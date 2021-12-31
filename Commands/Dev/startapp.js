const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const appExamples = require("../../Structures/Templates/app-ex-answ.json")
const ApplicationQuestions = require("../../Structures/Templates/applicationQuestions.json")

module.exports = {
    name: "startapp",
    description: "Start Applications",
    options: [
        {
            name: "channel",
            description: "Choose a channel to send the Start App message.",
            type: "CHANNEL",
            required: true
        }
    ],

    /**
     * @param {CommandInteraction} interaction
     * @param {client} client
     */
    execute(interaction, client) {

        const { options } = interaction;

        const channel = options.getChannel("channel")

        const Response = new MessageEmbed()
            .setTitle('Click the Button below to start an Application form')
            .setDescription(`When clicking the Button below you will start your applicationform.\nThis will start in your DirectMessages, so make sure you allow directmessages from this server.\nYou will be needed to fill in all the questions to finish the ApplicationForm\n\nThe Questions:`)
            .setFooter(`Click the Button below to Start!`)

        for (let l = 0; l < ApplicationQuestions.length; l++) {
            Response.addField(`${ApplicationQuestions[l]}:`, `${appExamples[l]}`, true);
        }

        const Button = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('start-application')
                    .setLabel('Apply here for CT3 & 4')
                    .setStyle('PRIMARY'),
            );

        channel.send({ embeds: [Response], components: [Button] })
        interaction.reply({ content: `started in ${channel}`, ephemeral: true })
    }

}