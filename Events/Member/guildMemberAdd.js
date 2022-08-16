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

        const Welcomer = new WebhookClient({ id: "1009064379033059428", token: `${client.config.WelcomeToken}` })
        const Logger = new WebhookClient({ id: "926506667816939560", token: `${client.config.LogToken}` })

        const Welcome = new EmbedBuilder()
            .setColor("#000080")
            .setAuthor({ name: user.tag, iconUrl: user.avatarURL({ dynamic: true, size: 512 }) })
            .setDescription(`Welcome ${member} to **${guild.name}**\nYou're welcome to start an applicationform in <#1006613986277589062>\nAlso checkout our Public services!\nMember Count: **${guild.memberCount}**`)
            .setFooter({ text: `Member joined ${guild.name}` })

        Welcomer.send({ text: `${member}`, embeds: [Welcome] })
    }
}
