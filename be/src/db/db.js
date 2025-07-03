const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { DB } = require("../config/setting");

const connectDB = asyncHandler(async () => {
  await mongoose.connect(DB, {
    autoIndex: true,
  });
  console.log("Databse is connected");
});

module.exports = { connectDB };
