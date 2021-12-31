const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton, Client, Channel } = require("discord.js");
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
        if (interaction.customId !== "submit-application") return;
        const { channel, user, member } = interaction;

        const Messages = await channel.messages.fetch();
        const StaffButtons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId("accept-application")
                    .setLabel("Accept")
                    .setStyle("SUCCESS"),
                new MessageButton()
                    .setCustomId("deny-application")
                    .setLabel("Deny")
                    .setStyle("DANGER")
            )

        const Filtered = [];

        (await Messages).filter((m) => {
            if (!m.author.bot) {
                Filtered.push(m);
                i++
            }
        })

        await channel.bulkDelete(Filtered)

        const Initialmessage = Messages.first();
        const InitialEmbed = Initialmessage.embeds[0]
        const AnswerEmbed = new MessageEmbed(InitialEmbed)
            .setTitle(`Application submitted`)
            .setDescription("You have submitted your application for Review!\nPlease wait patiently so that our Staff team can review your application!")
            .setFooter("The buttons below are Staff Only")

        Initialmessage.edit({ embeds: [AnswerEmbed], components: [StaffButtons] })
        interaction.reply({ content: "Your Applications has successfully been submitted!", ephemeral: true })

        const EndEmbed = new MessageEmbed(InitialEmbed)
            .setTitle(`${interaction.user.username} Submitted an application!`)
            .setAuthor(interaction.user.username)
            .setDescription(`${channel}\n${user}'s Account was Created <t:${parseInt(user.createdTimestamp / 1000)}:R>\nJoined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>`)
            .setColor("ORANGE")
        const StaffChannel = client.channels.cache.get('797422520655413276');
        StaffChannel.send({ embeds: [EndEmbed] }).then(async (message) => {
            await new submitDB({
                MessageID: `${message.id}`,
                ChannelID: channel.id
            }).save()
        })

        console.log(`${user.username} has submitted an application`);


    }
}