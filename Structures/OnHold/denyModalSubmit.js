const delay = async ms => new Promise(res => setTimeout(res, ms))
const { EmbedBuilder, InteractionType } = require("discord.js");
const ApplicationCache = require("memory-cache");
const submitDB = require("../Schemas/submit-schema");


module.exports = {
    name: "interactionCreate",
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     * @param {Modal} modal
     * @returns 
     */
    async execute(interaction, modal) {
        if (interaction.type !== InteractionType.ModalSubmit) return;
        if (interaction.customId !== "denyModal") return
        if (!["410953870643298314", "432217612345278476"].includes(interaction.user.id)) return interaction.reply({ content: "Permissions missing", ephemeral: true })

        const { channel, user } = interaction

        const Document = await ApplicationCache.get(channel.id)
        if (!Document) return;
        if (user.id !== Document.UserID) return;

        const userEndpointEmbed = new EmbedBuilder()

        const selectMenuInteractionValue = modal.getSelectMenuValues('theme');
        console.log(modal)
        if (selectMenuInteractionValue[0] === "info") {
            userEndpointEmbed.setDescription(`**Hey ${user.username},**\n\nThank you for your application to join Create Technical! We appreciate your interest in our community and your time in filling out the application. Unfortunately, we must decline your application at this current time.\n\nWe’re looking for members who fit our community well. To be able to determine whether this is the case, we ask that your application is clear, concise, and well-written. The reason you are seeing this message is because that was not the case. We ask that you reapply in a while with more information, or if this is your second or third time trying, endeavour to find another community that might better suit you.\n\nFeel free to check out our current public server offerings to see if they are of interest, and we hope that you stick around to see what the technical community will get up to in the future! We wish you the best of luck in your journey with the Create mod.\n\nSincerely,\nThe Create Technical Team`)
            interaction.reply({ content: `Thank you for your application to join Create Technical! We appreciate your interest in our community and your time in filling out the application. Unfortunately, we must decline your application at this current time.\n\nWe’re looking for members who fit our community well. To be able to determine whether this is the case, we ask that your application is clear, concise, and well-written. The reason you are seeing this message is because that was not the case. We ask that you reapply in a while with more information, or if this is your second or third time trying, endeavour to find another community that might better suit you.\n\nFeel free to check out our current public server offerings to see if they are of interest, and we hope that you stick around to see what the technical community will get up to in the future! We wish you the best of luck in your journey with the Create mod.\n\nSincerely,\nThe Create Technical Team\n\nThis Channel has been closed and is Transcripted to a HTML File.` })
        } else if (selectMenuInteractionValue[0] === "underage") {
            userEndpointEmbed.setDescription(`**Hey ${user.username},**\n\nThank you for your application to join Create Technical! We appreciate your interest in our community and your time in filling out the application. Unfortunately, we must decline your application at this current time.\n\nUnfortunately our current player base is a bit older than you have indicated and we feel uncomfortable exposing those who are on the younger side to more mature content.\n\nFeel free to check out our current public server offerings to see if they are of interest, and we hope that you stick around to see what the technical community will get up to in the future! We wish you the best of luck in your journey with the Create mod.\n\nSincerely,\nThe Create Technical Team`)
            interaction.reply({ content: `Thank you for your application to join Create Technical! We appreciate your interest in our community and your time in filling out the application. Unfortunately, we must decline your application at this current time.\n\nThank you for your application to join Create Technical! We appreciate your interest in our community and your time in filling out the application. Unfortunately, we must decline your application at this current time.\n\nUnfortunately our current player base is a bit older than you have indicated and we feel uncomfortable exposing those who are on the younger side to more mature content.\n\nFeel free to check out our current public server offerings to see if they are of interest, and we hope that you stick around to see what the technical community will get up to in the future! We wish you the best of luck in your journey with the Create mod.\n\nSincerely,\nThe Create Technical TeamThis Channel has been closed and is Transcripted to a HTML File.` })
        } else if (selectMenuInteractionValue[0] === "lack_experience") {
            userEndpointEmbed.setDescription(`**Hey ${user.username},**\n\nThank you for your application to join Create Technical! We appreciate your interest in our community and your time in filling out the application. Unfortunately, we must decline your application at this current time.\n\nWe're looking for members with a little more experience with create as this is more a place for experienced players rather than someone just starting out. We would love to have you apply again down the road when you have spent more time playing with Create!\n\nFeel free to check out our current public server offerings to see if they are of interest, and we hope that you stick around to see what the technical community will get up to in the future! We wish you the best of luck in your journey with the Create mod.\n\nSincerely,\nThe Create Technical Team`)
            interaction.reply({ content: `Thank you for your application to join Create Technical! We appreciate your interest in our community and your time in filling out the application. Unfortunately, we must decline your application at this current time.\n\nWe're looking for members with a little more experience with create as this is more a place for experienced players rather than someone just starting out. We would love to have you apply again down the road when you have spent more time playing with Create!\n\nFeel free to check out our current public server offerings to see if they are of interest, and we hope that you stick around to see what the technical community will get up to in the future! We wish you the best of luck in your journey with the Create mod.\n\nSincerely,\nThe Create Technical Team\n\nThis Channel has been closed and is Transcripted to a HTML File.` })
        } else return console.error("DenyValue not detected")


        console.log(`Application by ${user.username} was denied, reason: ${value}`)

        await delay(1000)

        const attachment = await Transcripts.createTranscript(interaction.channel);
        userEndpointEmbed.setFooter({ text: "The channel has been deleted. You can view a transcript of the channel by downloading the HTML file and opening it in your browser." })

        user.send({ embeds: [userEndpointEmbed], files: [attachment] })

        const result = await submitDB.find({ ChannelID: channel.id })
        const StaffChannel = client.channels.cache.get('797422520655413276');
        const message = await StaffChannel.messages.fetch(`${result[0].MessageID}`)
        const InitialEmbed = message.embeds[0]
        const AnswerEmbed = EmbedBuilder.from(InitialEmbed)
            .setColor("RED")
            .setTitle("APPLICATION DENIED")
        message.edit({ embeds: [AnswerEmbed], files: [attachment] })

        await delay(10000) // 10 sec

        channel.delete()
    }
}