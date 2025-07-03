const { model } = require("mongoose");
const ctl = require("../controllers/Claim.ctl");
const { authenticateToken } = require("../middleware/Auth");

module.exports = (app) => {
  app.post("/claim", authenticateToken, ctl.claimItem);
};
