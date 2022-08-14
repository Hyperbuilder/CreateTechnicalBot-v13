const { CommandInteraction, Client, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { required } = require("nodemon/lib/config");
const { description } = require("./status");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("emitt")
        .setDescription("Emitt an userevent")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option.setName("member")
                .setDescription("GuildMember Events")
                .setRequired(true)
                .addChoices(
                    { name: "guildMemberAdd", value: "guildMemberAdd", },
                    { name: "guildMemberRemove", value: "guildMemberRemove", }
                )),
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const choices = interaction.options.getString("member");

        client.on("applicationCommandPermissionsUpdate")

        switch (choices) {
            case "guildMemberAdd": {
                client.emit("guildMemberAdd", interaction.member)
                interaction.reply({ content: "Event Emitted", ephemeral: true })
            }
                break;
            case "guildMemberRemove": {
                client.emit("guildMemberRemove", interaction.member)
                interaction.reply({ content: "Event Emitted", ephemeral: true })
            }
        }
    }
}