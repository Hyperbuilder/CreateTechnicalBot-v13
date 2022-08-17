const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, Client, Channel, ButtonStyle } = require("discord.js");
// const { ButtonStyle } = require("discord-api-types/v10");
const ApplicationCache = require("memory-cache")
const applicationDB = require("../../Structures/Schemas/application-schema");
const submitDB = require("../../Structures/Schemas/submit-schema");
const applicationQuestions = require("../../Structures/Templates/applicationQuestions.json")

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
        if (interaction.customId !== "submit-application") return;

        const { channel, user, member } = interaction;

        await interaction.deferReply()

        const Document = await ApplicationCache.get(channel.id)
        if (!Document) return;
        if (user.id !== Document.UserID) return;
        let Answers = Document.Answers

        const StaffUserButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("accept-application")
                    .setLabel("Accept")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("deny-application")
                    .setLabel("Deny")
                    .setStyle(ButtonStyle.Danger)
            )

        const recievedMessage = (await channel.messages.fetch()).first()
        const recievedEmbed = await recievedMessage.embeds[0]

        const UserSubmitEndpointEmbed = new EmbedBuilder.from(recievedEmbed)
            .setTitle(`Application submitted`)
            .setDescription("You have submitted your application for Review!\nPlease wait patiently so that our Staff team can review your application!")
            .setFooter({ text: "The buttons below are Staff Only" })

        recievedMessage.edit({ embeds: [UserSubmitEndpointEmbed], components: [StaffUserButtons] })

        console.log("Submit Embed Sent")

        const StaffChannel = client.channels.cache.get('797422520655413276');
        const StaffChannelEndpointEmbed = new EmbedBuilder()
            .setTitle(`${interaction.user.username} Submitted an application!`)
            .setDescription(`${channel}\n\n${user}'s Account was Created <t:${parseInt(user.createdTimestamp / 1000)}:R>\nJoined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>`)
            .setColor("ffa500")

        await Answers.forEach(Answer => {
            let num = Answers.indexOf(Answer)
            StaffChannelEndpointEmbed.addFields({ name: `${applicationQuestions[num].data.text}`, value: Answer, inline: true })
        });

        StaffChannel.send({ embeds: [StaffChannelEndpointEmbed] }).then(async (message) => {
            await new submitDB({
                MessageID: `${message.id}`,
                ChannelID: channel.id
            }).save()

        })

        console.log(`${user.username} has submitted an application`);
        interaction.editReply({ content: "Succesfully submitted applicationform", ephemeral: true })

    }
}