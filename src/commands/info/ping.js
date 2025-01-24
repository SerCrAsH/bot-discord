
export default {
    DESCRIPTION: "Ping command",
    //PERMISSIONS: ["Administrator", "KickMembers", "BanMembers"],
    OWNER: true,
    async execute(client, message, args, prefix) {
        return message.reply(`\`${client.ws.ping}ms\``);
    }
}