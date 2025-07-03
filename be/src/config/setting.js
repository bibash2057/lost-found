require("dotenv").config();

module.exports = {
  DB: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
