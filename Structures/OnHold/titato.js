const { CommandInteraction, Client, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ttt")
        .setDescription("TICTACTOE!")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    /**
     * 
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {

        const tictactoe = new EmbedBuilder()
            .setTitle("TicTacToe")


        const tttbuttonrow1 = new ActionRowBuilder()
        const tttbuttonrow2 = new ActionRowBuilder()
        const tttbuttonrow3 = new ActionRowBuilder()

        for (let c = 0; c < 3; c++) {
            tttbuttonrow1.addComponents(
                new ButtonBuilder().setCustomId(`1${c}`).setEmoji(`⬛`).setStyle(ButtonStyle.Secondary)
            )
        }

        for (let c = 0; c < 3; c++) {
            tttbuttonrow2.addComponents(
                new ButtonBuilder().setCustomId(`2${c}`).setEmoji(`⬛`).setStyle(ButtonStyle.Secondary)
            )
        }

        for (let c = 0; c < 3; c++) {
            tttbuttonrow3.addComponents(
                new ButtonBuilder().setCustomId(`3${c}`).setEmoji(`⬛`).setStyle(ButtonStyle.Secondary)
            )
        }



        interaction.reply({ embeds: [tictactoe], components: [tttbuttonrow1, tttbuttonrow2, tttbuttonrow3] })
    }

}
