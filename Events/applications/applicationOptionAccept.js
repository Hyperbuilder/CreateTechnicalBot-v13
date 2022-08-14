const { ButtonInteraction, EmbedBuilder, Client } = require("discord.js");
const ApplicationCache = require("memory-cache")
const applicationDB = require("../../Structures/Schemas/application-schema");
const submitDB = require("../../Structures/Schemas/submit-schema");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "accept-application") return;
        if (!["410953870643298314", "432217612345278476"].includes(interaction.user.id)) return interaction.reply({ content: "I only follow CSH's orders! (Missing Permissions)", ephemeral: true })

        const { channel, user } = interaction;

        const result = await submitDB.find({ ChannelID: channel.id })


        const StaffChannel = client.channels.cache.get('797422520655413276');
        const message = await StaffChannel.messages.fetch(`${result[0].MessageID}`)
        const InitialEmbed = message.embeds[0]
        const AnswerEmbed = new EmbedBuilder(InitialEmbed)
            .setColor("GREEN")
            .setTitle("APPLICATION ACCEPTED")
        message.edit({ embeds: [AnswerEmbed] })

        const cache = await ApplicationCache.get(channel.id)
        console.log(cache)
        const userID = await cache.UserID
        const userDM = await client.users.fetch(userID)

        const DMembed = new EmbedBuilder()
            .setTitle("Create Technical Application")
            .setDescription(`Congratulations! Your application to join Create Technical has been accepted!\nGet your whitelist in <#1003331777064083557>`)
        userDM.send({ embeds: [DMembed] })
        interaction.reply({ content: "Application accepted", ephemeral: true })

        const guild = await client.guilds.fetch("733694336570490921")
        console.log(guild)
        if (!guild) return console.log("No Guild FOUND")
        const role = await guild.roles.cache.get("733785266745245737");
        guild.members.cache.get(userID).roles.add(role)

        await applicationDB.updateOne({ ChannelID: channel.id }, {
            Member: true
        });
    }
}