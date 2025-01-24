
const trolling = function (message, content) {
    switch (true) {
        case /^hola$/i.test(content):
            return message.reply("Pa' ti mi cola");
        case /qui[eè]n ha muerto\??/i.test(content):
            return message.reply("Zayler");
        default:
            break;
    }
}
export default {
    DESCRIPTION: "Trolling",
    async execute(client, message, args, prefix) {
        return trolling(message, message.content);
    },
    trolling: trolling
}