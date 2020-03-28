var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var testCaseSchema = new Schema(
  {
    input: {
      type: String,
      required: true
    },
    result: {
      type: String,
      required: true
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: "challenge"
    }
  },
  { timestamps: true }
);

var Testcase = mongoose.model("testcase", testCaseSchema);

module.exports = Testcase;
 