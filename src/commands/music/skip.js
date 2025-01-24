
export default {
    DESCRIPTION: "Skip current song",
    ALIASES: ["next"],
    OWNER: false,
    execute: async (client, message, args, prefix) => {
        if (!message?.member?.voice?.channel) return message.reply("You need to join a voice channel first");

        if (message.guild.members?.me?.voice?.channel
            && message.member.voice?.channel.id != message.guild.members?.me?.voice?.channel.id) {
            return message.reply("You need to be in the same voice channel as me");
        }

        try {
            await client.DisTube.skip(message.member.voice?.channel);

            message.reply(`⏭️ Skipped song...`);
        } catch (e) {
            mmessage.reply(`Error executing command : ${e}`);
            console.log(`Error: ${e}`);
        }
    }
}