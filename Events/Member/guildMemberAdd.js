const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {GuildMember} member 
     */
    execute(member) {

        const { user, guild } = member;

        // add role //

        const Welcomer = new WebhookClient({
            id: "922633574677618699",
            token: "WW2HLjSnlYEcZRmFLKUUCbVHHGR_axCoBatSIvWj1-L9-T1450dlNCdMMD_YO6-Z-jzP"
        })

        const Welcome = new MessageEmbed()
            .setColor("NAVY")
            .setAuthor(user.tag, user.avatarURL({ dynamic: true, size: 512 }))
            .setDescription(`Welcome ${member} to **${guild.name}**\nAccount Created: <t:${parseInt(user.createdTimestamp / 1000)}:R>\nMember Count: **${guild.memberCount}**`)
            .setFooter(`ID: ${user.id}`)

        Welcomer.send({ embeds: [Welcome] })
    }
}
