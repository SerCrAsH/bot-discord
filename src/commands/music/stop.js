
export default {
    DESCRIPTION: "Stop playing music",
    OWNER: false,
    execute: async (client, message, args, prefix) => {
        if (!message?.member?.voice?.channel) return message.reply("You need to join a voice channel first");

        if (message.guild.members?.me?.voice?.channel
            && message.member.voice?.channel.id != message.guild.members?.me?.voice?.channel.id) {
            return message.reply("You need to be in the same voice channel as me");
        }

        try {
            await client.DisTube.stop(message.member.voice?.channel);

            message.reply(`⏹️ Stop playing`);
        } catch (e) {
            message.reply(`Error executing command : ${e}`);
            console.log(`Error: ${e}`);
        }
    }
}