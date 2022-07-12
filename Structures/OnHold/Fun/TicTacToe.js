const { CommandInteraction, Client, MessageEmbed, MessageActionRow } = require("discord.js");
module.exports = {
    name: "status",
    description: "Displays Bot status",
    /**
     * 
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    execute(interaction, client) {

        const Response = new MessageEmbed()
            .setDescription(`**CLIENT**: \`✔ ONLINE\` - \`${client.ws.ping}ms\`\n**UPTIME**: <t:${parseInt(client.readyTimestamp / 1000)}:R>\n**MONGODB**: \`${switchTo(connection.readyState)}\``)

        interaction.reply({ embeds: [Response] })
    }

}