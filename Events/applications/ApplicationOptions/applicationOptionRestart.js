const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const ApplicationCache = require("memory-cache")
const applicationDB = require("../../../Structures/Schemas/application-schema");
const applicationQuestions = require("../../../Structures/Templates/applicationQuestions.json")


module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "restart-application") return;

        const { user, channel } = interaction;
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

        let Answers = [];


        const messages = await (await channel.messages.fetch({})).map(m => m);
        await channel.bulkDelete(messages.length)

        ApplicationCache.del(channel.id);

        await applicationDB.updateOne({ ChannelID: channel.id }, {
            Answers: Answers,
            QuestionNumber: 0,
            Member: false,
            Submit: false
        });

        ApplicationCache.put(channel.id, {
            UserID: user.id,
            ChannelID: channel.id,
            Answers: Answers,
            QuestionNumber: 0,
            TotalQuestions: applicationQuestions.length,
            Member: false,
            Submit: false

        })

        const Initial = new MessageEmbed()
            .setTitle("Welcome to your Application")
            .setDescription(`**READ WITH CARE** You will soon start your application!\nThe application consists of ${applicationQuestions.length} [**Questions**](${interaction.message.url}) These questions will appear above! Below this you will find an overview of all the questions and your answers\nNote: **all** questions must be answered to submit the application`)
            .setFooter("Use the Buttons below to Stop or Redo your application")
        for (let l = 0; l < applicationQuestions.length; l++) {
            Initial.addField(`${applicationQuestions[l]}:`, `To be answered`, true);
        }

        channel.send({ embeds: [Initial], components: [UserButtons] })
    }
}
