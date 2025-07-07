const ctl = require("../controllers/Item.ctl");
const { authenticateToken } = require("../middleware/Auth");

module.exports = (app) => {
  app.get("/report", ctl.getAllItem);
  app.get("/report/:id", authenticateToken, ctl.getItemById);
  app.get("/reportedItem", authenticateToken, ctl.getMyReportedItems);
  app.delete("/report/:id", authenticateToken, ctl.delteItem);
  app.post("/report", authenticateToken, ctl.reportItem);
};
