const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton, Client } = require("discord.js");
const ApplicationCache = require("memory-cache")
const applicationDB = require("../../Structures/Schemas/application-schema");
const applicationQuestions = require("../../Structures/Templates/applicationQuestions.json")
const appExamples = require("../../Structures/Templates/app-ex-answ.json")


module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "start-application") return;

        //---[ Check amount of channels in application category ]---//
        const categoryChannel = client.channels.cache.get('802690281312485416')
        if (categoryChannel.children.size >= 50) {
            console.error(`ALERT: Category ${categoryChannel.name} is FULL, ${categoryChannel.children.size}`)
            return interaction.reply({ content: "Currently we are at discords capacity of 50 channels. Please ping Hyperbuilder!", ephemeral: true });
        }

        const { member, guild, user } = interaction;

        let Answers = [];
        let QuestionNumber = 1;

        //---[ Check if user has an open application ]---//
        const result = await applicationDB.findOne({ UserID: user.id })
        if (result !== null) {
            if (result.submit) return interaction.reply({ content: "You have an application awaiting review, Please wait for your previously submitted application to be reviewed", ephemeral: true })
            if (result) return interaction.reply({ content: "You have an application open! Please close or finish the open application first.\n\*if you think this is an error. Dm Hyperbuilder\*", ephemeral: true })
        }

        //---[ Setup initial Embed to send to user ]---//
        const Initial = new MessageEmbed()
            .setTitle("Welcome to your Application! \nRead below!")
            .setDescription(`**READ WITH CARE** Your application will start soon!\nThe application consists of ${applicationQuestions.length} [**Questions**](${interaction.message.url})\nNote: **all** questions must be answered to submit the application`)
            .setFooter("Use the Buttons below to Stop or Restart your application. Stopping an Application will **delete** this channel!")

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
                    .setLabel("Question #1")
                    .setStyle("SECONDARY")
            )

        //---[ Create Application channel ]---//
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
            //---[ Notify that user has started an application ]---//
            interaction.reply({ content: `Your application started in ${channel}`, ephemeral: true })
            channel.send({ embeds: [Initial], components: [UserButtons] })
            console.log(`New channel created. ID: ${channel.id}`)

            //---[ Store Channel Id, User Id, etc. in Cache and MongoDB ]---//
            await new applicationDB({
                UserID: interaction.user.id,
                ChannelID: channel.id,
                Answers: Answers,
                QuestionNumber: QuestionNumber,
                TotalQuestions: applicationQuestions.length,
                Member: false,
                Submit: false
            }).save()

            await ApplicationCache.put(channel.id, {
                UserID: interaction.user.id,
                ChannelID: channel.id,
                Answers: Answers,
                QuestionNumber: QuestionNumber,
                TotalQuestions: applicationQuestions.length,
                Member: false,
                Submit: false
            })
        })
    }
}
