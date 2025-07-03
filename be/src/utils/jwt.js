const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/setting");

exports.generateToken = (user) => {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: "5h",
  });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
