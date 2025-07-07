const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

exports.authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;
  console.log("authHeader", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("error", err);
      res.status(401).json({ success: false, message: "Token is not Valid" });
    }
    if (!err) {
      req.user = decoded;
      next();
    }
  });
});
