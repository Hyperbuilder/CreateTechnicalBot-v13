const { Client } = require("discord.js")
const mongoose = require("mongoose")
const { Database } = require("../../config.json")

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Client} client
     */
    execute(client) {
        console.log("The client is now Ready")
        client.user.setActivity("CTL", { type: "WATCHING" })

        if (!Database) return;
        mongoose.connect(Database, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("The client succesfully connected to the database")
        }).catch((err) => {
            console.log(err)
        })
    }
}