const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton, Client } = require("discord.js");
const ApplicationCache = require("memory-cache")
const applicationDB = require("../../../Structures/Schemas/application-schema");
const submitDB = require("../../../Structures/Schemas/submit-schema");

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
        if (interaction.user.id !== "410953870643298314") return interaction.reply({ content: "Permissions missing", ephemeral: true })

        const { channel, user } = interaction;

        const result = await submitDB.find({ ChannelID: channel.id })
        console.log(result[0].MessageID)

        applicationDB.findOneAndUpdate({})

        const StaffChannel = client.channels.cache.get('797422520655413276');
        const message = await StaffChannel.messages.fetch(`${result[0].MessageID}`)
        const InitialEmbed = message.embeds[0]
        const AnswerEmbed = new MessageEmbed(InitialEmbed)
            .setColor("GREEN")
            .setTitle("APPLICATION ACCEPTED")
        message.edit({ embeds: [AnswerEmbed] })
        const cache = await ApplicationCache.get(channel.id)
        const userDM = await client.users.fetch(cache.UserID)

        const BotChannel = client.channels.cache.get('778816644284940328');
        const DMembed = new MessageEmbed()
            .setTitle("Congratulations!")
            .setDescription(`Congrats! I have great news! Your applicatiion has been accepted\nRemember to stay within the rules!\nGo to ${BotChannel} to get whitelisted for the Survival and Creative server!`)
        userDM.send({ embeds: [DMembed] })
        interaction.reply({ content: "Application accepted", ephemeral: true })


    }
}
