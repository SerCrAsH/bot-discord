
export default {
    DESCRIPTION: "Play any song you want",
    OWNER: false,
    execute: async (client, message, args, prefix) => {
        if (!args.length) return message.reply("You need to provide a song name or link");
        if (!message?.member?.voice?.channel) return message.reply("You need to join a voice channel first");

        if (message.guild.members?.me?.voice?.channel
            && message.member.voice?.channel.id != message.guild.members?.me?.voice?.channel.id) {
            return message.reply("You need to be in the same voice channel as me");
        }

        const song = args.join(" ");

        try {
            client.DisTube.play(message.member.voice?.channel, song, {
                member: message.member,
                textChannel: message.channel,
                message
            });

            message.reply(`** Searching ** ${song}...`)
                .then((msg) => {
                    setTimeout(() => {
                        msg.delete().catch((e) => { });
                    }, 2000);
                });
        } catch (e) {
            message.reply(`Error while playing ${song}... : ${e}`);
            console.log(`Error: ${e}`);
        }
    }
}