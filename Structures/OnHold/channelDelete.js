const { EmbedBuilder, Client, Channel } = require("discord.js");
const ApplicationCache = require("memory-cache")
const submitDB = require("../../Structures/Schemas/submit-schema");
const applicationDB = require("../../Structures/Schemas/application-schema")
const Transcripts = require('discord-html-transcripts');
const delay = async ms => new Promise(res => setTimeout(res, ms))




module.exports = {
    name: "channelDelete",
    /**
     * 
     * @param {Channel} channel
     * @param {Client} client
     */
    async execute(channel, client) {

        const Document = await ApplicationCache.get(channel.id)
        if (!Document) return;

        ApplicationCache.del(channel.id);
        await applicationDB.findOneAndDelete({ ChannelID: channel.id })
        console.log(`${channel.name} Forcefully deleted. ID: ${channel.id}`)
    }
}
