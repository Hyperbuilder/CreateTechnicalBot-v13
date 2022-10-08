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

        if (["940164024329445419", "915376519881293885"].includes(member.id)) { interaction.reply(`Shame on you ${interaction.member} Why would you! Dont ping Everyone!`) }


        interaction.reply({ content: `Shame on you ${member} SHAME! how could you!` });

    }
}