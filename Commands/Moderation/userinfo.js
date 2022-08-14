const { CommandInteraction, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Get Info about a GuildMember")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("Select a User")
        ),
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const target = await interaction.guild.members.fetch(option.get("user"));

        const Response = new EmbedBuilder()
            .setColor("AQUA")
            .setAuthor(target.user.tag, target.user.avatarURL({ dynamic: true, size: 512 }))
            .setThumbnail(target.user.avatarURL({ dynamic: true, size: 512 }))
            .addField("ID", `${target.user.id}`, true)
            .addField("Roles", `${target.roles.cache.map(r => r).join(" ").replace("@everyone", " ") || "None"}`)
            .addField("Member since", `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`, true)
            .addField("User since", `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`, true)

        interaction.reply({ embeds: [Response], ephemeral: true })
    }
}