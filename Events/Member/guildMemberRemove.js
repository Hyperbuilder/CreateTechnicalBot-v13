const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     * 
     * @param {GuildMember} member 
     */
    execute(member) {

        const { user, guild } = member;

        // add role //

        const Logger = new WebhookClient({
            id: "922636939377672192",
            token: "IK19XNSKUg4uLB6ECO5YJgvDH7m4wq-J88dsuDZ6NBH8OOm0o25w39rRDbd0XmN2V3PQ"
        })

        const Log = new MessageEmbed()
            .setColor("AQUA")
            .setAuthor(user.tag, user.avatarURL({ dynamic: true, size: 512 }))
            .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
            .setDescription(`${member} Left **${guild.name}**\nJoined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>\nMember Count: **${guild.memberCount}**`)
            .setFooter(`ID: ${user.id}`)

        Logger.send({ embeds: [Log] })
    }
}
