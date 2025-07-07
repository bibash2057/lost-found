const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    type: { type: String, emun: ["Lost", "Found"], required: true },
    title: { type: String, required: true },
    des: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Bag",
        "Document",
        "Mobile",
        "Laptop",
        "Electronics",
        "Jewelry",
        "Keys",
        "Wallet",
        "Pet",
        "Other",
      ],
      required: true,
    },
    photos: [String],
    location: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: Number,
      lng: Number,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "Verifying", "Claimed"],
      default: "Open",
    },
    verificationQuestions: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    claimedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      claimId: { type: mongoose.Schema.Types.ObjectId, ref: "Claim" },
      claimedAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
