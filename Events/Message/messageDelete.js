const { MessageEmbed, Message, WebhookClient } = require("discord.js");
const ApplicationCache = require("memory-cache");

module.exports = {
    name: "messageDelete",
    /**
     * 
     * @param {Message} message
     */
    async execute(message) {
        if (message.author.bot) return;
        const Document = await ApplicationCache.get(message.channel.id)
        if (Document) return;

        const Log = new MessageEmbed()
            .setColor("RED")
            .setDescription(`A [**Message**](${message.url}) by ${message.author} was **Deleted** in ${message.channel}.\n
        **Deleted content:**\n\`\`\`${message.content ? message.content : "none"}\`\`\``.slice(0, 4096))
            .setFooter(`Member: ${message.author.tag} | ID ${message.author.id}`);

        if (message.attachments.size >= 1) {
            Log.addField("Attachments:", `${message.attachments.map(a => a.url)}`, true)
        }


        new WebhookClient({ url: "https://discord.com/api/webhooks/924442971691159554/wAWWXWYKnsg1JzKUIfShrqnRMlB3i22TiiGmnQPhW7oIx6v1di2RCdwsbiXYl9iv-2XL" })
            .send({ embeds: [Log] })
    }
}