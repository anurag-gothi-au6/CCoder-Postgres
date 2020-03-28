const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const challengeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    description: {
      type: String,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    func_name: {
      type: String,
      required: true
    },
    no_of_args:{
      type:Number,
      required:true
    },
    func_py: {
      type: String,
      required: true
    },
    func_node: {
      type: String,
      required: true
    },
    func_java: {
      type: String,
      required: true
    },
    func_cpp: {
      type: String,
      required: true
    },
    func_c: {
      type: String,
      required: true
    },
    output: {
      type: String,
      trim: true,
    },
    editorial: {
      type: String
    },
    maxScore: {
      type: Number,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user"
    },
    bookmarkedBy: [
      {
      type: Schema.Types.ObjectId,
      ref: "user"
      }
    ],
    testCases: [
      {
        type: Schema.Types.ObjectId,
        ref: "testcase"
      }
    ],
    discussions: [
      {
        type: Schema.Types.ObjectId,
        ref: "discussion"
      }
    ],
    submissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "submission"
      }
    ],
    contest: {
          type: Schema.Types.ObjectId,
          ref: "contest"
      },

  },
  { timestamps: true }
);

const Challenge = mongoose.model("challenge", challengeSchema);

module.exports = Challenge;
