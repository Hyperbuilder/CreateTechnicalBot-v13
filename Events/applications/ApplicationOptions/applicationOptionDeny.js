const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageSelectMenu, Client } = require("discord.js");
const ApplicationCache = require("memory-cache")
const submitDB = require("../../../Structures/Schemas/submit-schema");
const applicationOptionAccept = require("./applicationOptionAccept");


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
        if (interaction.customId !== "deny-application") return;
        if (!["410953870643298314", "432217612345278476"].includes(interaction.user.id)) return interaction.reply({ content: "Permissions missing", ephemeral: true })

        const { channel } = interaction;

        const selectMenuRow = new MessageActionRow()
            .addComponents([
                new MessageSelectMenu()
                    .setCustomId('deniedSelectMenu')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'Intentional Application Spam',
                            description: 'Reason: Intentionally spamming applications.',
                            value: 'spam',
                        },
                        {
                            label: 'Underage, ToS',
                            description: 'Reason: User is Underage (Under 13), and therefor breaking Terms of Service.',
                            value: 'underage',
                        },
                        {
                            label: 'Lack of Experience',
                            description: 'Reason: Showing inexperience about Create.',
                            value: 'lack_experience',
                        },
                        {
                            label: 'Inappropriate behaviour',
                            description: 'Reason: Showing behaviour the communitiy wont tolerate',
                            value: 'behaviour',
                        },
                    ]),
            ]);

        const userEmbedMessage = await (await interaction.channel.messages.fetch()).first()
        const initialUserEmbed = userEmbedMessage.embeds[0];
        const newUserEmbed = new MessageEmbed(initialUserEmbed);
        userEmbedMessage.edit({ embeds: [newUserEmbed], components: [selectMenuRow] });

        const result = await submitDB.find({ ChannelID: channel.id })

        const StaffChannel = client.channels.cache.get('797422520655413276');
        const message = await StaffChannel.messages.fetch(`${result[0].MessageID}`)
        const InitialEmbed = message.embeds[0]
        const AnswerEmbed = new MessageEmbed(InitialEmbed)
            .setColor("RED")
            .setTitle("APPLICATION DENIED")
        message.edit({ embeds: [AnswerEmbed] })
    }
}
