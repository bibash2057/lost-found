const bcrypt = require("bcryptjs");
const User = require("../models/User.models");
const { generateToken } = require("../utils/jwt");
const asyncHandler = require("express-async-handler");

exports.register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Name is required" });
  }

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  if (!phone) {
    return res
      .status(400)
      .json({ success: false, message: "Phone is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "Password is required" });
  }

  const existingUser = await User.findOne({ email, phone });
  if (existingUser) {
    return res
      .status(401)
      .json({ success: false, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  const payload = {
    id: user._id,
  };

  const token = generateToken(payload);

  res.status(200).json({
    success: true,
    message: "Organization created successfully",
    token: token,
    data: user,
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, phone, password } = req.body;

  const user = await User.findOne({ phone });

  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Invalid Phone Number" });

  const isMatch = await bcrypt.compare(password, user?.password);
  if (!isMatch)
    return res
      .status(401)
      .json({ success: false, message: "Invalid Password" });

  const payload = {
    id: user._id,
  };

  const token = generateToken(payload);

  res.status(200).json({
    success: true,
    message: "Login successful!",
    token: token,
    data: user,
  });
});
