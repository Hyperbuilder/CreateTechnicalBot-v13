const { EmbedBuilder, WebhookClient, GuildMember, Client } = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    /**
     * 
     * @param {GuildMember} member 
     * @param {Client} client
     */
    execute(member, client) {

        const { user, guild } = member;

        // add role //

        const Logger = new WebhookClient({ id: "926506667816939560", token: `${client.config.LogToken}` })

        const Log = new EmbedBuilder()
            .setColor("#ff2800")
            .setAuthor({ name: user.tag, iconUrl: user.avatarURL({ dynamic: true, size: 512 }) })
            .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
            .setDescription(`${member} Left **${guild.name}**\nJoined: <t:${parseInt(member.joinedTimestamp / 1000)}:R>\nMember Count: **${guild.memberCount}**`)
            .setFooter({ text: `ID: ${user.id}` })

        Logger.send({ embeds: [Log] })
    }
}
