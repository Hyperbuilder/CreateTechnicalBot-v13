const { MessageEmbed, Message, WebhookClient } = require("discord.js");

module.exports = {
    name: "messageUpdate",
    /**
     * 
     * @param {Message} oldMessage 
     * @param {Message} newMessage 
     */
    execute(oldMessage, newMessage) {
        if (oldMessage.author.bot) return;
        if (oldMessage.content === newMessage.content) return;

        const Count = 1950

        const Original = oldMessage.content.slice(0, Count) + (oldMessage.content.length > Count ? " ..." : "");
        const Edited = newMessage.content.slice(0, Count) + (newMessage.content.length > Count ? " ..." : "");

        const Log = new MessageEmbed()
            .setColor("RED")
            .setDescription(`A [**Message**](${newMessage.url}) by ${newMessage.author} was **edited** in ${newMessage.channel}.\n
        **Original:**\n \`\`\`${Original}\`\`\`\n**Edited:**\n\`\`\`${Edited}\`\`\``.slice("0", "4096"))
            .setFooter(`Member: ${newMessage.author.tag} | ID ${newMessage.author.id}`);


        new WebhookClient({ url: "https://discord.com/api/webhooks/924442971691159554/wAWWXWYKnsg1JzKUIfShrqnRMlB3i22TiiGmnQPhW7oIx6v1di2RCdwsbiXYl9iv-2XL" })
            .send({ embeds: [Log] })
    }
}