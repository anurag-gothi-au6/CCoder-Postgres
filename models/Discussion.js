const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const discussionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        challenge: {
            type: Schema.Types.ObjectId,
            ref: 'challenge'
        },
        text: {
            type: String,
            required: true
        }
    },
    { timestamps: true}
);

const Discussion = mongoose.model("discussion", discussionSchema);

module.exports = Discussion;