const { CommandInteraction, Client } = require("discord.js");
const { required } = require("nodemon/lib/config");
const { description } = require("./status");

module.exports = {
    name: "emitt",
    description: "Event emitter",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "member",
            description: "GuildMember Events",
            type: 3,
            required: true,
            choices: [
                {
                    name: "guildMemberAdd",
                    value: "guildMemberAdd",
                },
                {
                    name: "guildMemberRemove",
                    value: "guildMemberRemove",
                }
            ]
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    execute(interaction, client) {
        const choices = interaction.options.getString("member");

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