const { SelectMenuInteraction, MessageEmbed, MessageActionRow, MessageButton, Client } = require("discord.js");
const ApplicationCache = require("memory-cache")
const applicationDB = require("../../Structures/Schemas/application-schema");
const submitDB = require("../../Structures/Schemas/submit-schema");
const Transcripts = require('discord-html-transcripts');





module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {SelectMenuInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isSelectMenu()) return;
        if (interaction.customId !== "deniedSelectMenu");
        if (!["410953870643298314", "432217612345278476"].includes(interaction.user.id)) return interaction.reply({ content: "Permissions missing", ephemeral: true })


        const result = await submitDB.find({ ChannelID: interaction.channel.id })

        const StaffChannel = client.channels.cache.get('797422520655413276');
        const message = await StaffChannel.messages.fetch(`${result[0].MessageID}`)
        const InitialEmbed = message.embeds[0]
        const AnswerEmbed = new MessageEmbed(InitialEmbed)
            .setColor("RED")
            .setTitle("APPLICATION DENIED")
        message.edit({ embeds: [AnswerEmbed] })


        const Document = await ApplicationCache.get(channel.id)
        if (!Document) return;
        if (user.id !== Document.UserID) return;
        const DMembed = new MessageEmbed()

        const value = interaction.values

        console.log(`Application by ${user.username} was denied, reason: ${value}`)

        //TODO Add case specific sentences, CSH
        switch (value) {
            case "spam":
                DMembed.setDescription("spam")
                break;
            case "underage":
                DMembed.setDescription("underage")
                break;
            case "lack_experience":
                DMembed.setDescription("lack of xp")
                break;
            case "behaviour":
                DMembed.setDescription("behaviour")
                break;
        }

        DMembed.setFooter({ text: "The channel has been deleted. You can view a transcript of the channel by downloading this HTML file and opening it in your browser." })

        const attachment = await Transcripts.createTranscript(interaction.channel);
        user.send({ embeds: [DMembed], files: [attachment] })
        interaction.reply({ content: `The application has succesfully been denied, Reason: ${value}\n This channel will soon be deleted!`, ephemeral: true })

    }
}
