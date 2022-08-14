// const { ButtonStyle } = require("discord-api-types/v10");
const { CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits, ButtonStyle } = require("discord.js");
const appExamples = require("../../Structures/Templates/app-ex-answ.json")
const ApplicationQuestions = require("../../Structures/Templates/applicationQuestions.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("startapp")
        .setDescription("Message Embed for Application System")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName("channel")
                .setDescription("Channel to send Message")
                .setRequired(true)),

    /**
     * @param {CommandInteraction} interaction
     * @param {client} client
     */
    execute(interaction, client) {

        const { options } = interaction;

        const channel = options.getChannel("channel")

        const Response = new EmbedBuilder()
            .setTitle('Click the Button below to start an Application form')
            .setDescription(`When clicking the Button below you will start your applicationform.\nThis will start in your DirectMessages, so make sure you allow directmessages from this server.\nYou will be needed to fill in all the questions to finish the applicationform\n\nThe Questions:`)
            .setFooter({ text: `Click the Button below to Start!` })

        for (let l = 0; l < ApplicationQuestions.length; l++) {
            Response.addFields({ name: ` ${ApplicationQuestions[l].data.text}:`, value: `${appExamples[l]}`, inline: true });
        }

        const Button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('start-application')
                    .setLabel('Apply here for Create Technical!')
                    .setStyle(ButtonStyle.Primary),
            );

        channel.send({ embeds: [Response], components: [Button] })
        interaction.reply({ content: `started in ${channel}`, ephemeral: true })
    }

}