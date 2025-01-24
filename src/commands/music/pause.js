
export default {
    DESCRIPTION: "Pause song",
    OWNER: false,
    execute: async (client, message, args, prefix) => {
        if (!message?.member?.voice?.channel) return message.reply("You need to join a voice channel first");

        if (message.guild.members?.me?.voice?.channel
            && message.member.voice?.channel.id != message.guild.members?.me?.voice?.channel.id) {
            return message.reply("You need to be in the same voice channel as me");
        }

        try {
            await client.DisTube.pause(message.member.voice?.channel);

            message.reply(`⏸️ Paused`);
        } catch (e) {
            message.reply(`Error executing command : ${e}`);
            console.log(`Error: ${e}`);
        }
    }
}