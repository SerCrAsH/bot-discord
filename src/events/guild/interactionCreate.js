
export default async (client, interaction) => {
    if (!interaction.guild || !interaction.channel || interaction.user.bot) return;

    console.log(`[${new Date(interaction.createdTimestamp).toISOString()}]`.grey +
        `[${interaction.guild.name}][${interaction.channel.name}]`.blue +
        `[${interaction.user.tag}]:`.red + `/${interaction.commandName}`.white);


    const command = client.commands.get(interaction?.commandName);

    if (command) {
        if (command.OWNER) {
            if (!process.env.OWNER_IDS.includes(interaction.user.id)) {
                if (!owner.includes(interaction.user.id)) {
                    return interaction.reply("You are not the owner of the bot.");
                }
            }

            if (command.BOT_PERMISSIONS) {
                if (!interaction.guild.members.me.permissions.has(command.BOT_PERMISSIONS)) {
                    return interaction.reply(`I don't have the necessary permissions to execute this command: ${command.BOT_PERMISSIONS.map(permission => `\`${permission}\``).join(", ")}`);
                }
            }

            if (command.PERMISSIONS) {
                if (!interaction.guild.members.me.permissions.has(command.PERMISSIONS)) {
                    return interaction.reply(`You don't have the necessary permissions to execute this command: ${command.PERMISSIONS.map(permission => `\`${permission}\``).join(", ")}`);
                }
            }

            try {
                command.execute(client, interaction, "/");
            } catch (e) {
                console.error(e);
                interaction.reply(`An error occurred while executing this command ${command.name}.`);
            }
        }

    }
}