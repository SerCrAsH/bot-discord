import { SlashCommandBuilder } from "discord.js";

export default {
    CMD: new SlashCommandBuilder().setDescription("Ping command"),
    //PERMISSIONS: ["Administrator", "KickMembers", "BanMembers"],
    OWNER: true,
    async execute(client, interaction, prefix) {
        console.log('executing ping slash command');
        return interaction.reply(`\`${client.ws.ping}ms\``);
    }
}