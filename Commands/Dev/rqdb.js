const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { connection } = require("mongoose");
const applicationDB = require("../../Structures/Schemas/application-schema");
require("../../Events/Client/ready");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rqdb")
        .setDescription("Request ALL data from Database")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    /**
     * 
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {

        const applicationQueries = await applicationDB.find({ Member: false })

        applicationQueries.forEach(document => {
            interaction.channel.send({ content: `\`\`\`${document}\`\`\`` })
        })

    }

}