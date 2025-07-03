const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
    claims: [{ type: mongoose.Schema.Types.ObjectId, ref: "Claim" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
