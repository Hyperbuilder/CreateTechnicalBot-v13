const { CommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggest")
        .setDescription("Suggest a Minecraft mod")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption((option) =>
            option
                .setName("modlink")
                .setDescription("Curseforge or Modrinth HTTPS link to modpage")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("functionality")
                .setDescription("Describe mod, provide arguments.")
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options } = interaction;

        const modlink = options.getString("modlink");
        const funcs = options.getString("functionality");

        const Response = new EmbedBuilder()
            .setColor("AQUA");

        function useRegex(input) {
            let regex = /https:\/\/www\.curseforge\.com\/minecraft\/mc-mods\/[a-zA-Z]+/i;
            if (!regex.test(input)) {
                let mregex = /https:\/\/modrinth\.com\/mod\/[a-zA-Z]+/i
                return mregex.test(input)
            } else return true
        }

        if (!useRegex(modlink)) {
            Response.setDescription(`${modlink} is an incorrect link\nMake sure you are inputting a CurseForge or Modrinth Link\nExample: https://www.curseforge.com/minecraft/mc-mods/create`)
            interaction.reply({ embeds: [Response], ephemeral: true })
        } else {
            Response.setDescription(`${interaction.member} has suggested a mod!`)
            Response.addFields(
                { name: "Link:", value: `${modlink}` },
                { name: "Functionality:", value: `${funcs}` }
            )
            const message = await interaction.reply({ embeds: [Response], fetchReply: true })
            message.react("👍")
            message.react("👎")
        }
    }
}