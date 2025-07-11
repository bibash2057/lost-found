const Item = require("../models/Item.models");
const Claim = require("../models/Claim.models");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

exports.claimItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { answers } = req.body;

  let parsedAnswers = answers;
  try {
    if (typeof answers === "string") {
      parsedAnswers = JSON.parse(answers);
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Invalid answers format",
    });
  }

  const item = await Item.findById(id);

  console.log(userId, item?.postedBy?._id.toString());

  if (userId === item?.postedBy?._id?.toString()) {
    return res.status(401).json({
      success: false,
      message: "You cannot claim an item you have posted.",
    });
  }
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

  if (item.status === "Approved")
    return res.status(404).json({
      success: false,
      message: "Item is not available for claiming",
    });

  if (
    !parsedAnswers ||
    parsedAnswers.length !== item.verificationQuestions.length
  ) {
    return res.status(400).json({
      success: false,
      message: `Please answer all ${item.verificationQuestions.length} verification questions`,
    });
  }

  let uploadedPhotoURLs = [];

  if (req.files && req.files.length > 0) {
    try {
      console.log("Req", req.file);
      uploadedPhotoURLs = await Promise.all(
        req.files.map((file) => uploadToCloudinary(req.files[0].buffer))
      );
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({ message: "Image upload failed" });
    }
  }

  const claim = new Claim({
    itemId: item._id,
    claimedBy: userId,
    answers: parsedAnswers,
    proofPhoto: uploadedPhotoURLs,
    status: "Pending",
  });

  const saveClaim = await claim.save();

  item.status = "Verifying";
  item.claimedBy = {
    userId: userId,
    claimId: saveClaim._id,
    claimedAt: Date.now(),
  };

  await item.save();

  res.status(201).json({
    success: true,
    message: "Item claimed successfully",
    data: {
      claim: saveClaim,
      item: item,
    },
  });
});

exports.getClaimReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid item ID",
    });
  }

  const item = await Item.findById(id).populate("postedBy", "_id");

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });
  }

  if (item.postedBy._id.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized, You are not the owner of this item",
    });
  }

  console.log("Item");
  const claims = await Claim.find({ itemId: id }).populate(
    "claimedBy",
    "name email phone"
  );

  res.status(200).json({
    success: true,
    data: {
      item,
      claims,
    },
  });
});

exports.updateClaim = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  console.log("Received update request:", { id, status, userId });

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid item ID",
    });
  }

  if (!status) {
    return res
      .status(400)
      .json({ success: false, message: "Status is required" });
  }

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status. Must be 'Approved' or 'Rejected'",
    });
  }

  const claim = await Claim.findById(id).populate({
    path: "itemId",
    select: "postedBy status",
    populate: {
      path: "postedBy",
      select: "_id",
    },
  });

  if (!claim) {
    return res.status(404).json({
      success: false,
      message: "Claim not found",
    });
  }

  if (claim.itemId.postedBy._id.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized - You are not the owner of this item",
    });
  }

  if (claim.status !== "Pending") {
    return res.status(400).json({
      success: false,
      message: `Claim has already been ${claim.status.toLowerCase()}`,
    });
  }

  if (status === "Approved") {
    const existingApprovedClaim = await Claim.findOne({
      itemId: claim.itemId._id,
      status: "Approved",
    });

    if (existingApprovedClaim) {
      return res.status(400).json({
        success: false,
        message: "Item already has an approved claim",
        data: {
          existingApprovedClaimId: existingApprovedClaim._id,
        },
      });
    }
  }

  const updateClaim = await Claim.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (status === "Approved") {
    await Item?.findByIdAndUpdate(claim.itemId._id, {
      status: "Claimed",
      claimedBy: {
        userId: claim.claimedBy,
        claimId: claim._id,
        claimedAt: Date.now(),
      },
    });

    await Claim.updateMany(
      {
        itemId: claim.itemId._id,
        status: "Pending",
        _id: { $ne: claim._id },
      },
      { status: "Rejected" }
    );
  }

  if (status === "Rejected") {
    const hasApprovedClaims = await Claim.exists({
      itemId: claim.itemId._id,
      status: "Approved",
    });

    if (!hasApprovedClaims) {
      await Item.findByIdAndUpdate(claim.itemId._id, {
        status: "Open",
        $unset: { claimedBy: "" },
      });
    }
  }

  res.status(201).json({
    success: true,
    message: `Claim ${status.toLowerCase()} successfully`,
    data: {
      claim: updateClaim,
      itemStatus: status === "Approved" ? "Claimed" : "Verifying",
    },
  });
});
