const { CommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shame")
        .setDescription("Shame a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("WHO WE SHAMIN'????")
                .setRequired(true)
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        const { options } = interaction;

        const member = options.getMember("member")
        interaction.channel.send({ content: `Shame on you ${member} SHAME! how could you!` });

    }
}