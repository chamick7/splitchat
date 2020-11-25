const mongoose = require("mongoose");

const chatSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  msg: { type: String, required: true },
  sender: { type: String, required: true },
  senderID: { type: String, required: true },
  activityID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Activity',
  },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Chat", chatSchema);
