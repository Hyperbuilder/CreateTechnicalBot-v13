const { Client, CommandInteraction, MessageEmbed, ContextMenuInteraction } = require("discord.js");
const { execute } = require("../Client/ready");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName)
            if (!command) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("⛔ an Error has occured while running this command.")
                ]
            }) && client.commands.delete(interaction.commandName);

            command.execute(interaction, client)
        }
    }
}