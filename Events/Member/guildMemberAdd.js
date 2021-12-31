const { MessageEmbed, WebhookClient, GuildMember } = require("discord.js");
const WelcomerURL = require("../../Structures/config.json")
module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {GuildMember} member 
     */
    execute(member) {

        const { user, guild } = member;

        // add role //

        const Welcomer = new WebhookClient({ url: WelcomerURL })

        const Welcome = new MessageEmbed()
            .setColor("NAVY")
            .setAuthor(user.tag, user.avatarURL({ dynamic: true, size: 512 }))
            .setDescription(`Welcome ${member} to **${guild.name}**\nAccount Created: <t:${parseInt(user.createdTimestamp / 1000)}:R>\nMember Count: **${guild.memberCount}**`)
            .setFooter(`ID: ${user.id}`)

        Welcomer.send({ embeds: [Welcome] })
    }
}
