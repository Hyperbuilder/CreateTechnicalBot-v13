const { Client, CommandInteraction, EmbedBuilder, ContextMenuInteraction } = require("discord.js");
const { execute } = require("../Client/ready");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client) {

        console.log(`${interaction.name} has been triggered by ${interaction.user.username}`)

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

            console.log(`${interaction.commandName} has been triggered by ${interaction.user.username}`)
            command.execute(interaction, client)
        }
    }
}