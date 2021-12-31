const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { connection } = require("mongoose");
require("../../Events/Client/ready");

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
            .setColor("AQUA")
            .setDescription(`**CLIENT**: \`✔ ONLINE\` - \`${client.ws.ping}ms\`\n**UPTIME**: <t:${parseInt(client.readyTimestamp / 1000)}:R>\n**MONGODB**: \`${switchTo(connection.readyState)}\``)

        interaction.reply({ embeds: [Response] })
    }

}

function switchTo(val) {
    var status = " ";
    switch (val) {
        case 0: status = "🔴 DISCONNECTED"
            break;
        case 1: status = "🟢 CONNECTED"
            break;
        case 2: status = "🟠 CONNECTING"
            break;
        case 3: status = "🛑 DISCONNECTING"
            break;
    }
    return status
}