const { CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "clear",
    description: "Delete Messages from a channel or Target",
    permission: "",
    options: [
        {
            name: "amount",
            description: "Select the amount to delete from a Channel or Target",
            type: "NUMBER",
            required: true,
        },
        {
            name: "target",
            description: "Select the Target to remove messages from",
            type: "USER",
            required: false
        }
    ],

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async execute(interaction) {
        const { channel, options } = interaction;

        const Amount = options.getNumber("amount");
        const Target = options.getMember("target");

        const Messages = await channel.messages.fetch();

        const Response = new MessageEmbed()
            .setColor("AQUA");

        if (Target) {
            let i = 0;
            const Filtered = [];

            (await Messages).filter((m) => {
                if (m.author.id === Target.id && Amount > i) {
                    Filtered.push(m);
                    i++
                }
            })

            await channel.bulkDelete(Filtered, true).then(messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} from ${Target}.`)
                interaction.reply({ embeds: [Response] })
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                Response.setDescription(`🧹 Cleared ${messages.size} from this channel`)
                interaction.reply({ embeds: [Response] })
            })
        }
    }
}