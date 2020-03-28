const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const submissionSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        language: {
            type: String,
            required: true
        },
        challenge: {
            type: Schema.Types.ObjectId,
            ref: 'challenge'
        },
        code: {
            type: String,
            required: true
        },
        score:{
            type:Number,
            required:true
        }
    },
    { timestamps: true}
);

const Submission = mongoose.model("submission", submissionSchema);

module.exports = Submission;