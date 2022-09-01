const { Client, CommandInteraction, EmbedBuilder, ContextMenuInteraction } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client) {

        console.log(`${interaction.customId ? `${interaction.customId} button has been pressed by` : `${interaction.commandName} has been triggered by`}  ${interaction.user.username}`)

        if (interaction.isChatInputCommand() || interaction.isUserContextMenuCommand()) {
            const command = client.commands.get(interaction.commandName)
            if (!command) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("RED")
                        .setDescription("⛔ an Error has occured while running this command.")
                ],
                empheral: true
            }) && client.commands.delete(interaction.commandName);
            command.execute(interaction, client)
        }
    }
}