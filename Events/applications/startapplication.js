const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const ApplicationCache = require("memory-cache")
const applicationDB = require("../../Structures/Schemas/application-schema");
const applicationQuestions = require("../../Structures/Templates/applicationQuestions.json")
const appExamples = require("../../Structures/Templates/app-ex-answ.json")


module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "start-application") return;

        const { member, guild, user } = interaction;

        let Answers = [];
        let QuestionNumber = 0;

        const Initial = new MessageEmbed()
            .setTitle("Welcome to your Application! Read below!")
            .setDescription(`**READ WITH CARE** You will soon start your application!\nThe application consists of ${applicationQuestions.length} [**Questions**](${interaction.message.url}) These questions will appear above! Below this you will find an overview of all the questions and your answers\nNote: **all** questions must be answered to submit the application\n\nYou can now start your application by answering the first Question!`)
            .setFooter("Use the Buttons below to Stop or Restart your application. Stopping an Application will **delete** this channel!")
        for (let l = 0; l < applicationQuestions.length; l++) {
            Initial.addField(`${applicationQuestions[l]}:`, `To be answered`, true);
        }

        const UserButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("restart-application")
                    .setLabel("Restart")
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("cancel-application")
                    .setLabel("Cancel")
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("submit-application")
                    .setLabel("Submit")
                    .setStyle("SUCCESS")
                    .setDisabled()
            )

        await guild.channels.create(`${user.username}s Application`, {
            type: "GUILD_TEXT",
            parent: "802690281312485416",
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                },
                {
                    id: "736160722311970877",
                    deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]
                }
            ],
            rateLimitPerUser: 2
        }).then(async (channel) => {
            await new applicationDB({
                UserID: interaction.user.id,
                ChannelID: channel.id,
                Answers: Answers,
                QuestionNumber: QuestionNumber,
                TotalQuestions: applicationQuestions.length,
                Member: false,
                Submit: false
            }).save()

            ApplicationCache.put(channel.id, {
                UserID: interaction.user.id,
                ChannelID: channel.id,
                Answers: Answers,
                QuestionNumber: QuestionNumber,
                TotalQuestions: applicationQuestions.length,
                Member: false,
                Submit: false
            })

            interaction.reply({ content: `Your application started in ${channel}`, ephemeral: true })
            channel.send({ embeds: [Initial], components: [UserButtons] })
            console.log(`New channel created. ID: ${channel.id}`)
        })
    }
}
