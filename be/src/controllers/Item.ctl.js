const Item = require("../models/Item.models");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
// const redisClient = require("../utils/redis");

exports.reportItem = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const {
    type,
    title,
    des,
    category,
    location,
    coordinates,
    verificationQuestions,
  } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid User",
    });
  }

  if (!type || !title || !category || !location) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  if (type === "Found") {
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
  }

  let uploadedPhotoURLs = [];

  if (req.files && req.files.length > 0) {
    try {
      console.log("Req", req.file);
      uploadedPhotoURLs = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({ message: "Image upload failed" });
    }
  }

  const newItem = new Item({
    type,
    title,
    des,
    category,
    photos: uploadedPhotoURLs,
    location,
    coordinates: coordinates || null,
    verificationQuestions: verificationQuestions || [],
    postedBy: id,
    status: "Open",
  });

  const savedItem = await newItem.save();

  // await redisClient.del(`reportedItem:${id}`);
  // await redisClient.del("allItems");

  res.status(201).json({
    success: true,
    message: "Item Reported  successfully",
    data: savedItem,
  });
});

exports.updateReportItem = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const userId = req.user.id;

  const {
    type,
    title,
    des,
    category,
    location,
    coordinates,
    verificationQuestions,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid item ID",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  if (!type || !title || !category || !location) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  if (type === "Found" && verificationQuestions?.length > 0) {
    const invalid = verificationQuestions.some((q) => !q.question || !q.answer);
    if (invalid) {
      return res.status(400).json({
        success: false,
        message: "Verification questions must have both question and answer",
      });
    }
  }

  const existingItem = await Item.findById(id);
  if (!existingItem) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }

  if (existingItem.postedBy.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to update this item",
    });
  }

  if (req.files && req.files.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Image updates are not allowed.",
    });
  }

  const updatedItem = await Item.findByIdAndUpdate(
    id,
    {
      type,
      title,
      des,
      category,
      location,
      coordinates: coordinates || null,
      verificationQuestions: verificationQuestions || [],
    },
    {
      new: true,
    }
  );

  // await redisClient.del(`item:${id}`);
  // await redisClient.del(`reportedItem:${userId}`);
  // await redisClient.del("allItems");

  res.status(200).json({
    success: true,
    message: "Item updated successfully",
    data: updatedItem,
  });
});

exports.getAllItem = asyncHandler(async (req, res) => {
  const { type, category, status, search } = req.query;

  let query = {};
  if (type) query.type = type;
  if (status) query.status = status;
  if (category) query.category = category;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  const cacheKey = "allItems";
  // const cached = await redisClient.get(cacheKey);

  // if (cached) {
  //   return res.status(200).json(JSON.parse(cached));
  // }

  const items = await Item.find(query)
    .populate("postedBy", "name email")
    .sort({ createdAt: -1 })
    .select("-verificationQuestions.answer");

  const [lostCount, foundCount] = await Promise.all([
    Item.countDocuments({ ...query, type: "Lost" }),
    Item.countDocuments({ ...query, type: "Found" }),
  ]);

  const response = {
    success: true,
    message: "Reported Items fetched successfully!",
    data: items,
    counts: {
      lost: lostCount,
      found: foundCount,
      total: items.length,
    },
  };

  // await redisClient.setEx(cacheKey, 3600, JSON.stringify(response));

  res.status(200).json(response);
});

exports.getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Valid category ID is required",
    });
  }

  const cacheKey = `item:${id}`;

  // const cachedItem = await redisClient.get(cacheKey);

  // if (cachedItem) {
  //   console.log("this is from redis");
  //   return res.status(200).json(JSON.parse(cachedItem));
  // }

  const item = await Item.findById(id)
    .populate({
      path: "postedBy",
      select: "name _id",
    })
    .populate({
      path: "claimedBy.userId",
      select: "name _id",
    })
    .select("-verificationQuestions.answer");

  if (!item)
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });

  const response = {
    success: true,
    message: "Reported Items fetched successfully!",
    data: item,
  };

  // await redisClient.setEx(cacheKey, 3000, JSON.stringify(response));

  res.status(200).json(response);
});

exports.getMyReportedItems = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const cacheKey = `reportedItem:${id}`;

  // const cached = await redisClient.get(cacheKey);

  // if (cached) {
  //   console.log("direct from redis");
  //   return res.status(200).json(JSON.parse(cached));
  // }

  const reportedItems = await Item.find({ postedBy: id })
    .sort({ createdAt: -1 })
    .select("-__v");

  const response = {
    success: true,
    message: "Reported Items fetched successfully!",
    data: reportedItems,
  };
  // await redisClient.setEx(cacheKey, 3600, JSON.stringify(response));

  res.status(200).json(response);
});

exports.delteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Valid category ID is required",
    });
  }

  const item = await Item.findById(id);

  if (item.postedBy.toString() !== req.user.id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized - You can only delete items you created",
    });
  }
  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });
  }

  const deleteItem = await Item.findByIdAndDelete(id);

  // await redisClient.del(`item:${id}`);
  // await redisClient.del(`reportedItem:${req.user.id}`);
  // await redisClient.del("allItems");

  res.status(200).json({
    success: true,
    message: "Reported item deleted successfully",
    data: {
      id: deleteItem._id,
      title: deleteItem.title,
    },
  });
});
