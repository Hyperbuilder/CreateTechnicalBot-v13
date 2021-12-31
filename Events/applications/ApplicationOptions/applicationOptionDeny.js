const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton, Client } = require("discord.js");
const ApplicationCache = require("memory-cache")
const submitDB = require("../../../Structures/Schemas/submit-schema");
const applicationOptionAccept = require("./applicationOptionAccept");

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
        if (interaction.customId !== "deny-application") return;

        const { channel } = interaction;

        const result = await submitDB.find({ ChannelID: channel.id })
        console.log(result[0].MessageID)

        const StaffChannel = client.channels.cache.get('797422520655413276');
        const message = await StaffChannel.messages.fetch(`${result[0].MessageID}`)
        const InitialEmbed = message.embeds[0]
        const AnswerEmbed = new MessageEmbed(InitialEmbed)
            .setColor("RED")
            .setTitle("APPLICATION DENIED")
        message.edit({ embeds: [AnswerEmbed] })
        interaction.reply({ content: "Application denied!", ephemeral: true })
        const cache = await ApplicationCache.get(channel.id)
        const userDM = await client.users.fetch(cache.UserID)

        const DMembed = new MessageEmbed()
            .setDescription("Im sorry to inform you that your Application has been denied\nYou are allowed to reapply ")
        userDM.send({ embeds: [DMembed] })



    }
}
