const { MessageEmbed, Message, Client, MessageActionRow, MessageButton } = require("discord.js");
const ApplicationCache = require("memory-cache");
const applicationDB = require("../Schemas/application-schema");
const applicationQuestions = require("../Templates/applicationQuestions.json")
const delay = async ms => new Promise(res => setTimeout(res, ms))

module.exports = {
    name: "messageCreate",
    /**
     * 
     * @param {Message} message 
     * @param {Client} client
     * @returns 
     */
    async execute(message, client) {
        if (message.author.bot) return

        const { channel, author, content } = message;

        const Document = await ApplicationCache.get(channel.id)
        if (!Document) return;
        if (author.id !== Document.UserID) return;

        await message.delete().catch((err) => {
            console.log('Could not delete the message', err)
            return channel.send("An internal error has occured! Please cancel this application using the button above and start over. Im very sorry for the inconvenience! -CTBot")
        })

        if (content.length > 1024) return channel.send("Your submitted answer has exeeded Discords limitations on Embeds. Please try to shorten your answer and submit your answer again!").then(async (message) => {
            await delay(2000)
            message.delete()
        })

        let Answers = Document.Answers;
        let QuestionNumber = Document.QuestionNumber;

        let activeApplication = {
            TotalQuestions: Document.TotalQuestions,
            Member: Document.Member,
            Submit: Document.Submit
        };

        if (QuestionNumber < Document.TotalQuestions) {

            ApplicationCache.del(channel.id);

            Answers.push(content);


            QuestionNumber++;

            await applicationDB.updateOne({ ChannelID: channel.id }, {
                Answers: Answers,
                QuestionNumber: QuestionNumber,
            });

            ApplicationCache.put(channel.id, {
                UserID: author.id,
                ChannelID: channel.id,
                Answers: Answers,
                QuestionNumber: QuestionNumber,
                TotalQuestions: activeApplication.TotalQuestions,
                Member: activeApplication.Member,
                Submit: activeApplication.Submit
            })

            const messages = await (await channel.messages.fetch({})).map(m => m)
            for (let y = 0; y < messages.length; y++) {
                if (!messages[y].author.bot) {
                    await messages[y].delete()
                }
            }

            const Initialmessage = messages[0];
            const InitialEmbed = Initialmessage.embeds[0]
            const AnswerEmbed = new MessageEmbed(InitialEmbed)
                .setTitle(`Question #${QuestionNumber}`)
                .setDescription(`${applicationQuestions[QuestionNumber] ? applicationQuestions[QuestionNumber] : ""}`)


            if (QuestionNumber === Document.TotalQuestions) {
                AnswerEmbed.setTitle("You have Finished your Application!")
                AnswerEmbed.setDescription("You can use the Submit button below to submit your application for review")
                const UserButtons = new MessageActionRow()
                    .setComponents(
                        new MessageButton()
                            .setCustomId("restart-application")
                            .setLabel("Restart")
                            .setStyle("PRIMARY"),
                        new MessageButton()
                            .setCustomId("stop-application")
                            .setLabel("Stop")
                            .setStyle("PRIMARY"),
                        new MessageButton()
                            .setCustomId("submit-application")
                            .setLabel("Submit")
                            .setStyle("SUCCESS")
                            .setDisabled(false)
                    )
                await applicationDB.updateOne({ ChannelID: channel.id }, {
                    Submit: true
                });

                return Initialmessage.edit({ embeds: [AnswerEmbed], components: [UserButtons] });
            }

            Initialmessage.edit({ embeds: [AnswerEmbed] });

        }
    }
}