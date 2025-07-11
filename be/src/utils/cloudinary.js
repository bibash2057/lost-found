const setting = require("../config/setting");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: setting.CLOUDINARY_CLOUD_NAME,
  api_key: setting.CLOUDINARY_API_KEY,
  api_secret: setting.CLOUDINARY_API_SECRET,
  secure: true,
});

module.exports = cloudinary;
