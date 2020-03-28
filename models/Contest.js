const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contestSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    url: {
      type: String,
    },
    startTime: {
      type: String,
      required: true,
      },
    endTime: {
      type: String,
      required: true
    },
    organizationName: {
      type: String,
    },
    organizationType: {
      type: String,
    },
    scoring: {
      type: Number,
      required: true
    },
    tagline: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    prizes: {
      type: String
    },
    rules: {
      type: String,
      required: true
    },
    signups: [{
      type: Schema.Types.ObjectId,
      ref: "user",
      unique:true
    }],
    moderators: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        unique:true
      }
    ],
    challenges: [
      {
        type: Schema.Types.ObjectId,
        ref: "challenge"
      }
    ]
  },
  { timestamps: true }
);

const Contest = mongoose.model("contest", contestSchema);

module.exports = Contest;
