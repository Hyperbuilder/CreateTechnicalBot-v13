const { model, Schema } = require("mongoose");

module.exports = model("applicationDatabase", new Schema({
    UserID: String,
    ChannelID: String,
    Answers: Array,
    QuestionNumber: Number,
    TotalQuestions: Number,
    Member: Boolean,
    Submit: Boolean
}))