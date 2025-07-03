const ctl = require("../controllers/Auth.ctl");

module.exports = (app) => {
  app.post("/register", ctl.register);
  app.post("/login", ctl.login);
};
