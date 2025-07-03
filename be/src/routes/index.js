module.exports = (app) => {
  require("./Auth.routes")(app);
  require("./Item.routes")(app);
  require("./Claim.routes")(app);
};
