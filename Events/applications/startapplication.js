const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, Client, ButtonStyle, ChannelType, PermissionFlagsBits } = require("discord.js");
// const { ButtonStyle } = require("discord-api-types/v10");
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
        const categoryChannel = client.channels.cache.get('737036004933763158')
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
        const Initial = new EmbedBuilder()
            .setTitle("Welcome to your Application! \nRead below!")
            .setDescription(`**READ WITH CARE** Your application will start soon!\nThe application consists of ${applicationQuestions.length} [**Questions**](${interaction.message.url})\nNote: **all** questions must be answered to submit the application`)
            .setFooter({ text: "Use the Buttons below to Stop or Restart your application. Stopping an Application will **delete** this channel!" })

        const UserButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("restart-application")
                    .setLabel("Restart")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("cancel-application")
                    .setLabel("Cancel")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("question")
                    .setLabel("Question #1")
                    .setStyle(ButtonStyle.Secondary)
            )

        //---[ Create Application channel ]---//
        await guild.channels.create({
            name: `${user.username}s Application`,
            type: ChannelType.GuildText,
            parent: "737036004933763158",
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                },
                {
                    id: "827226948102127656",
                    deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
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
