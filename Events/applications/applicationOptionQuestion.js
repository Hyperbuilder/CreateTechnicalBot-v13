const { ActionRowBuilder, ModalBuilder, TextInputComponent, User, Client, TextInputBuilder } = require("discord.js");
const ApplicationCache = require("memory-cache");
const applicationDB = require("../../Structures/Schemas/application-schema");
const applicationQuestions = require("../../Structures/Templates/applicationQuestions.json")
const delay = async ms => new Promise(res => setTimeout(res, ms))

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     * @param {Modal} modal
     * @returns 
     */
    async execute(interaction) {
        if (interaction.customId !== "question") return
        const { channel, user } = interaction

        const Document = await ApplicationCache.get(channel.id)
        if (!Document) return;
        if (user.id !== Document.UserID) return;

        let QuestionNumber = Document.QuestionNumber
        console.log(QuestionNumber)


        // Create the modal
        const modal = new ModalBuilder()
            .setCustomId('questionModal')
            .setTitle(`Question #${QuestionNumber}`);

        const textInputComponent = new TextInputBuilder()
            .setCustomId(applicationQuestions[QuestionNumber - 1].data.customId)
            .setLabel(applicationQuestions[QuestionNumber - 1].data.text)
            .setStyle(applicationQuestions[QuestionNumber - 1].data.type)
            .setMaxLength(1024)
            .setRequired(true)
        const textActionRow = new ActionRowBuilder().addComponents(textInputComponent);
        modal.addComponents(textActionRow);

        // if (applicationQuestions[QuestionNumber - 1].data.input === "menu") {

        //     const textInputComponent = new TextInputComponent()
        //         .setCustomId(applicationQuestions[QuestionNumber - 1].data.customId)
        //         .setLabel(applicationQuestions[QuestionNumber - 1].data.text)
        //         .setStyle(applicationQuestions[QuestionNumber - 1].data.type);
        //     const textActionRow = new MessageActionRow().addComponents(textInputComponent);
        //     modal.addComponents(textActionRow);
        // }

        await interaction.showModal(modal);
    }
}
