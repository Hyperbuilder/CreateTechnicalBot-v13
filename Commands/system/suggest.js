const { CommandInteraction, MessageEmbed } = require("discord.js")

module.exports = {
    name: "suggest",
    description: "Create a Suggestion",
    options: [
        {
            name: "modlink",
            description: "Provide a link to the CurseForge modpage!",
            type: 3,
            required: true,

        },
        {
            name: "functionality",
            description: "Describe the functionality of the mod!",
            type: 3,
            required: true,

        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { options } = interaction;

        const modlink = options.getString("modlink");
        const funcs = options.getString("functionality");

        const Response = new MessageEmbed()
            .setColor("AQUA");

        function useRegex(input) {
            let regex = /https:\/\/www\.curseforge\.com\/minecraft\/mc-mods\/[a-zA-Z]+/i;
            return regex.test(input);
        }

        if (!useRegex(modlink)) {
            Response.setDescription(`${modlink} is an incorrect CurseForge link\nMake sure you are inputting a CurseForgeLink\nExample: https://www.curseforge.com/minecraft/mc-mods/create`)
            interaction.reply({ embeds: [Response], ephemeral: true })
        } else {
            Response.setDescription(`${interaction.member} has suggested a mod!`)
            Response.addField("Link:", `${modlink}`)
            Response.addField("Functionality:", `${funcs}`)
            const message = await interaction.reply({ embeds: [Response], fetchReply: true })
            message.react("👍")
            message.react("👎")
        }
    }
}