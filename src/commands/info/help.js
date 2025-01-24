
export default {
    DESCRIPTION: "Help command",
    OWNER: false,
    async execute(client, message, args, prefix) {
        return message.reply(`Comandos principales: !play para reproducir música`);
    }
}