const { model, Schema } = require("mongoose");

module.exports = model("submitapplicationDatabase", new Schema({
    MessageID: String,
    ChannelID: String
}))