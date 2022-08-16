const { EmbedBuilder, WebhookClient, GuildMember } = require("discord.js");
module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {GuildMember} member 
     */
    execute(member, client) {

        const { user, guild } = member;

        // add role //

        await guild.roles.fetch() //optional - put it if the role is valid, but is not cached
        let role = guild.roles.cache.find(role => role.id === '827226948102127656')
        member.roles.add(role)

        const Welcomer = new WebhookClient({ id: "926506667816939560", token: `${client.config.WelcomeToken}` })
        const Logger = new WebhookClient({ id: "926506667816939560", token: `${client.config.LogToken}` })

        const Welcome = new EmbedBuilder()
            .setColor("#000080")
            .setAuthor({ name: user.tag, iconUrl: user.avatarURL({ dynamic: true, size: 512 }) })
            .setDescription(`Welcome ${member} to **${guild.name}**\nAccount Created: <t:${parseInt(user.createdTimestamp / 1000)}:R>\nMember Count: **${guild.memberCount}**`)
            .setFooter({ text: `ID: ${user.id}` })

        Welcomer.send({ content: `${member}` })
        Welcomer.send({ embeds: [Welcome] })
    }
}
