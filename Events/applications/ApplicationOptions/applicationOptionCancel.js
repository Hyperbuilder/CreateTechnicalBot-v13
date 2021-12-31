const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const ApplicationCache = require("memory-cache")
const applicationDB = require("../../../Structures/Schemas/application-schema");
const delay = async ms => new Promise(res => setTimeout(res, ms))


module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "cancel-application") return;

        const { user, channel } = interaction;

        interaction.reply("This channel will be deleted in 8 seconds!")
        await delay(8000)

        ApplicationCache.del(channel.id);

        await applicationDB.findOneAndDelete({ ChannelID: channel.id })

        await channel.delete()
        console.log("Channel Deleted, ID:" + channel.id)

    }
}
