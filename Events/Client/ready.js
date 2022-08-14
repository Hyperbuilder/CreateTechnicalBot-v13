const { Client } = require("discord.js")
const mongoose = require("mongoose")
const ApplicationCache = require("memory-cache")

const applicationDB = require("../../Structures/Schemas/application-schema");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        client.user.setActivity("YOU :P", { type: "WATCHING" })

        if (!client.config.Database) return;
        await mongoose.connect(client.config.Database, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("The client succesfully connected to the database")
        }).catch((err) => {
            console.log(err)
        })

        const applicationQueries = await applicationDB.find({ Member: false })

        applicationQueries.forEach(document => {
            ApplicationCache.put(document.ChannelID, {
                UserID: document.UserID,
                ChannelID: document.ChannelID,
                Answers: document.Answers,
                QuestionNumber: document.QuestionNumber,
                TotalQuestions: document.TotalQuestions,
                Member: document.Member,
                Submit: document.Submit
            })
        })



        console.log(`${applicationQueries.length} Document${applicationQueries.length !== 1 ? "s" : ""} Cached`)

        console.log("The client is now Ready")

    }
};

