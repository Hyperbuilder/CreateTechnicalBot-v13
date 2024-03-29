const delay = async ms => new Promise(res => setTimeout(res, ms))
const { ButtonInteraction, EmbedBuilder, Client } = require("discord.js");
const ApplicationCache = require("memory-cache")
const applicationDB = require("../../Structures/Schemas/application-schema");
const submitDB = require("../../Structures/Schemas/submit-schema");
const Transcripts = require("discord-html-transcripts")

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "accept-application") return;
        if (!["410953870643298314", "432217612345278476"].includes(interaction.user.id)) return interaction.reply({ content: "I only follow CSH's orders! (Missing Permissions)", ephemeral: true })

        const { channel, user, guild } = interaction;

        const result = await submitDB.find({ ChannelID: channel.id })

        const Document = await ApplicationCache.get(channel.id)
        if (!Document) return interaction.reply({ content: "Could'nt find user document. Sorry\n-Hyper" });

        const userID = await Document.UserID
        const userDM = await client.users.fetch(userID)

        const DMembed = new EmbedBuilder()
            .setTitle("Create Technical Application")
            .setDescription(`Congratulations! Your application to join Create Technical has been accepted!\nYou have been whitelisted automatically, if you filled in your username incorrectly or filled in multiple username check out <#1003331777064083557> to manually request a whitelist.`)
            .setFooter({ text: "A Transcription of the Application Channel can be requested. Ask Hyperbuilder" })


        let dmclosed = false;
        userDM.send({ embeds: [DMembed] }).catch(() => {
            dmclosed = true;
            interaction.followup({ content: "User has Direct Messages Closed for Create Technical!" })
        })

        interaction.reply({ content: "Application accepted" })

        if (!guild) return console.log("No Guild Found")
        const role = await guild.roles.cache.find(role => role.id === "733785266745245737");
        if (!role) return console.log("No Role Found")
        const member = await guild.members.fetch(userDM)
        member.roles.add(role).catch((err) => console.error(err))

        await applicationDB.updateOne({ ChannelID: channel.id }, {
            Member: true
        });

        const attachment = await Transcripts.createTranscript(channel, /*{ returnType: 'buffer' }*/);
        const StaffChannel = client.channels.cache.get('797422520655413276');
        const message = await StaffChannel.messages.fetch(`${result[0].MessageID}`)
        const InitialEmbed = message.embeds[0]
        const AnswerEmbed = EmbedBuilder.from(InitialEmbed)
            .setColor("#7CFC00")
            .setTitle("APPLICATION ACCEPTED")
            .setFooter({ text: "HTML File Contains Transcript of the Application!" })
        message.edit({ embeds: [AnswerEmbed], files: [attachment] })

        const Whitelistchannel = client.channels.cache.get("1001206474401390733")
        console.log(`Whitelisting Member ${Document.Answers[1]}`)
        Whitelistchannel.send({ content: `!~whitelist_everywhere ${Document.Answers[1]}` })

        if (dmclosed) return channel.send({ content: "Channel will not be deleted since Direct messages is Closed" })
        channel.send({ content: "Channel will be deleted in 10 seconds!\nTranscript will be stored" })



        await delay(10000) // 10 sec

        channel.delete()
    }
}
