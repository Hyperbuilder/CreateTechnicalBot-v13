const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");
const LogToken = require("../../config.json")

module.exports = {
    name: "guildMemberRemove",
    /**
     * 
     * @param {GuildMember} member 
     */
    execute(member) {

        const { user, guild } = member;

        // add role //

        const Logger = new WebhookClient({ id: "926506667816939560", token: `${LogToken}` })

        const Log = new MessageEmbed()
            .setColor("AQUA")
            .setAuthor(user.tag, user.avatarURL({ dynamic: true, size: 512 }))
            .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
            .setDescription(`${member} Left **${guild.name}**\nJoined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>\nMember Count: **${guild.memberCount}**`)
            .setFooter(`ID: ${user.id}`)

        Logger.send({ embeds: [Log] })
    }
}
