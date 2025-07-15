const ctl = require("../controllers/Item.ctl");
const upload = require("../middleware/multer");
const { authenticateToken } = require("../middleware/Auth");

module.exports = (app) => {
  app.get("/report", ctl.getAllItem);
  app.get("/report/:id", ctl.getItemById);
  app.get("/reportedItem", authenticateToken, ctl.getMyReportedItems);
  app.patch("/report/:id", authenticateToken, ctl.updateReportItem);
  app.delete("/report/:id", authenticateToken, ctl.delteItem);
  app.post(
    "/report",
    authenticateToken,
    upload.array("photos", 5),
    ctl.reportItem
  );
};
