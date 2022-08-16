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

        // guild.roles.fetch()
        // let role = guild.roles.cache.find(role => role.id === '827226948102127656')
        // member.roles.add(role)

        const Welcomer = new WebhookClient({ id: "1009064379033059428", token: `${client.config.WelcomeToken}` })
        const Logger = new WebhookClient({ id: "926506667816939560", token: `${client.config.LogToken}` })

        const Welcome = new EmbedBuilder()
            .setColor("#000080")
            .setAuthor({ name: user.tag, iconUrl: user.avatarURL({ dynamic: true, size: 512 }) })
            .setDescription(`Welcome ${member} to **${guild.name}**\nStart you application form in <#1006613986277589062>\nYou can also checkout our Public offerings! <#949407560014917693>\nMember Count: **${guild.memberCount}**`)
            .setFooter({ text: `${user.username} Joined ${guild.name}` })

        Welcomer.send({ content: `${member}` })
        Welcomer.send({ embeds: [Welcome] })
    }
}
