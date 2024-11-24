const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const secretSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Secret", secretSchema);
