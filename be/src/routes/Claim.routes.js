const { model } = require("mongoose");
const ctl = require("../controllers/Claim.ctl");
const { authenticateToken } = require("../middleware/Auth");
const upload = require("../middleware/multer");

module.exports = (app) => {
  app.get("/claimReport/:id", authenticateToken, ctl.getClaimReport);
  app.patch("/claimUpdate/:id", authenticateToken, ctl.updateClaim);
  app.post(
    "/claim/:id",
    authenticateToken,
    upload.array("proofPhoto", 2),
    ctl.claimItem
  );
};
