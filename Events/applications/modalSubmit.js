const delay = async ms => new Promise(res => setTimeout(res, ms))
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const ApplicationCache = require("memory-cache");
const applicationDB = require("../../Structures/Schemas/application-schema");
const applicationQuestions = require("../../Structures/Templates/applicationQuestions.json")

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     * @param {Modal} modal
     * @returns 
     */
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== "questionModal") return

        const { channel, user } = interaction

        const Document = await ApplicationCache.get(channel.id)
        if (!Document) return;
        if (user.id !== Document.UserID) return;
        let Answers = Document.Answers
        let QuestionNumber = Document.QuestionNumber
        let TotalQuestions = Document.TotalQuestions
        let Member = Document.Member
        let Submit = Document.Submit

        let response = await interaction.fields.getTextInputValue(applicationQuestions[QuestionNumber - 1].data.customId);
        if (response) await interaction.reply({ content: `Question #${QuestionNumber} recieved successfully!` })
        await delay(2000)
        interaction.deleteReply()

        ApplicationCache.del(channel.id);

        Answers.push(response)

        if (QuestionNumber === TotalQuestions) {

            const embed = new MessageEmbed()
                .setTitle("You have Finished your Application!")
                .setDescription("You can use the Submit button below to submit your application for review")

            Answers.forEach(Answer => {
                let num = Answers.indexOf(Answer)
                embed.addField(`${applicationQuestions[num].data.text}`, Answer, true)
            });

            const UserButtons = new MessageActionRow()
                .setComponents(
                    new MessageButton()
                        .setCustomId("restart-application")
                        .setLabel("Restart")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("cancel-application")
                        .setLabel("Cancel")
                        .setStyle("DANGER"),
                    new MessageButton()
                        .setCustomId("submit-application")
                        .setLabel("Submit")
                        .setStyle("SUCCESS")
                        .setDisabled(false)
                )
            await applicationDB.updateOne({ ChannelID: channel.id }, {
                Submit: true
            });

            interaction.message.edit({ embeds: [embed], components: [UserButtons] })

        }

        if (QuestionNumber < TotalQuestions) {


            QuestionNumber++
            await applicationDB.updateOne({ ChannelID: channel.id }, {
                Answers: Answers,
                QuestionNumber: QuestionNumber,
            });

            ApplicationCache.put(channel.id, {
                UserID: user.id,
                ChannelID: channel.id,
                Answers: Answers,
                QuestionNumber: QuestionNumber,
                TotalQuestions: TotalQuestions,
                Member: Member,
                Submit: Submit
            })


            const UserButtons = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("restart-application")
                        .setLabel("Restart")
                        .setStyle("SECONDARY"),
                    new MessageButton()
                        .setCustomId("cancel-application")
                        .setLabel("Cancel")
                        .setStyle("DANGER"),
                    new MessageButton()
                        .setCustomId("question")
                        .setLabel(`Question #${QuestionNumber}`)
                        .setStyle("SECONDARY")
                )

            interaction.message.edit({ components: [UserButtons] })

        }



    }
}
