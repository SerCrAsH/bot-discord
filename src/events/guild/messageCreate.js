import trolling from "../../commands/base/trolling.js";

export default async (client, message) => {
    if (!message.guild || !message.channel || message.author.bot) return;

    console.log(`[${new Date(message.createdTimestamp).toISOString()}]`.grey +
        `[${message.guild.name}][${message.channel.name}]`.blue +
        `[${message.author.tag}]:`.red + `${message.content}`.green);

    if (!message.content.startsWith(process.env.PREFIX)) {
        await trolling.trolling(message, message.content);
        return;
    }

    const ARGS = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const CMD = ARGS?.shift().toLowerCase();

    const command = client.commands.get(CMD) || client.commands.find(c => c.ALIASES && c.ALIASES.includes(CMD));

    if (!command) {
        return;
    }
    if (command.OWNER) {
        if (!process.env.OWNER_IDS.includes(message.author.id)) {
            return message.reply("You are not the owner of the bot.");
        }
    }

    if (command.BOT_PERMISSIONS) {
        if (!message.guild.members.me.permissions.has(command.BOT_PERMISSIONS)) {
            return message.reply(`I don't have the necessary permissions to execute this command: ${command.BOT_PERMISSIONS.map(permission => `\`${permission}\``).join(", ")}`);
        }
    }

    if (command.PERMISSIONS) {
        if (!message.guild.members.me.permissions.has(command.PERMISSIONS)) {
            return message.reply(`You don't have the necessary permissions to execute this command: ${command.PERMISSIONS.map(permission => `\`${permission}\``).join(", ")}`);
        }
    }

    try {
        command.execute(client, message, ARGS, process.env.PREFIX);
    } catch (e) {
        console.error(e);
        message.reply(`An error occurred while executing this command ${command.name}.`);
        return;
    }

}