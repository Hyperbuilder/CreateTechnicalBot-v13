const { Client } = require("discord.js")
const mongoose = require("mongoose")
const { Database } = require("../../Structures/config.json")
const ApplicationCache = require("memory-cache")

const applicationDB = require("../../Structures/Schemas/application-schema");

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        console.log("The client is now Ready")
        client.user.setActivity("CTL", { type: "WATCHING" })

        if (!Database) return;
        await mongoose.connect(Database, {
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



        console.log("Documents Cached")

    }
};

