const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
