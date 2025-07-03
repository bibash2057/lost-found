const Item = require("../models/Item.models");
const Claim = require("../models/Claim.models");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

exports.claimItem = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { answers, proofPhoto } = req.body;

  const item = await Item.findById(id);

  if (!item?._id || !mongoose.Types.ObjectId.isValid(item?._id)) {
    return res.status(401).json({
      success: false,
      message: "Valid Item ID is required",
    });
  }

  if (!item)
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });

  if (item.status !== "Open")
    return res.status(404).json({
      success: false,
      message: "Item is not available for claiming",
    });

  if (!answers || answers.length !== item.verificationQuestions.length)
    return res.status(400).json({
      success: false,
      message: `Please answer all ${item.verificationQuestions.length} verification questions`,
    });

  const claim = new Claim({
    itemId: item._id,
    claimedBy: id,
    answers,
    proofPhoto: proofPhoto || null,
    status: "Pending",
  });

  const saveClaim = await claim.save();

  item.status = "Verifying";
  item.claimedBy = {
    userId: id,
    claimId: saveClaim._id,
    claimedAt: Date.now(),
  };

  await item.save();

  res.status(201).json({
    success: true,
    message: "Item claimed successfully",
    data: {
      claim: saveClaim,
      ietm: item,
    },
  });
});
