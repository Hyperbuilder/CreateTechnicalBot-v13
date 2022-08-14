const { CommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear messages from target or channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("Select the amount to delete from a Channel or Target")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("Select a UserTarget")
        ),

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {
        const { channel, options } = interaction;

        const Amount = options.getNumber("amount");
        const Target = options.getMember("target");

        const Messages = await channel.messages.fetch();

        const Response = new EmbedBuilder()
            .setColor("AQUA");

        if (Target) {
            let i = 0;
            const Filtered = [];

            (await Messages).filter((m) => {
                if (m.author.id === Target.id && Amount > i) {
                    Filtered.push(m);
                    i++
                }
            })

            await channel.bulkDelete(Filtered, true).then(messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} from ${Target}.`)
                interaction.reply({ embeds: [Response] })
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} from this channel`)
                interaction.reply({ embeds: [Response] })
            })
        }
    }
}