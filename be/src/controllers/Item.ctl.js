const Item = require("../models/Item.models");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

exports.reportItem = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const {
    type,
    title,
    category,
    photos,
    location,
    coordinates,
    verificationQuestions,
    date,
  } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid User",
    });
  }

  if (!type || !title || !category || !location || !date) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  if (verificationQuestions && verificationQuestions.length > 0) {
    const invalidQuestions = verificationQuestions.some(
      (q) => !q.question || !q.answer
    );

    if (invalidQuestions) {
      return res.status(400).json({
        success: false,
        message: "Verification questions must have both question and answer",
      });
    }
  }

  const newItem = new Item({
    type,
    title,
    category,
    photos: photos || [],
    location,
    coordinates: coordinates || null,
    verificationQuestions: verificationQuestions || [],
    date,
    postedBy: id,
    status: "Open",
  });

  const savedItem = await newItem.save();

  res.status(201).json({
    success: true,
    message: "Item Reported  successfully",
    data: savedItem,
  });
});

exports.getAllItem = asyncHandler(async (req, res) => {
  const { type, category, status, search } = req.query;

  let query = {};
  if (type) query.type = type;
  if (status) query.status = status;
  if (category) query.type = category;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  const items = await Item.find(query)
    .populate("postedBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Reported Items fetched successfully!",
    data: items,
  });
});

exports.getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Valid category ID is required",
    });
  }
  const item = await Item.findById(id).populate("postedBy claimedBy.userId");

  if (!item)
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });

  res.status(200).json({
    success: true,
    message: "Reported Items fetched successfully!",
    data: item,
  });
});

exports.delteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Valid category ID is required",
    });
  }

  const item = await Item.findByIdAndDelete(id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Reported item deleted successfully",
    data: {
      id: item._id,
      title: item.title,
    },
  });
});
