const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const db = require("./src/db/db");
const express = require("express");
const cloudinary = require("cloudinary");

const { notFound, errorHandler } = require("./src/middleware/error-handler");
const setting = require("./src/config/setting");

const PORT = setting.PORT || 8000;
const app = express();

db.connectDB();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

require("./src/routes/index")(app);
require("./src/models/index");

app.use(notFound);
app.use(errorHandler);

// cloudinary.api.ping((error, result) => {
//   if (error) console.error("Cloudinary connection error:", error);
//   else console.log("Cloudinary connection successful:", result);
// });

app.get("/", (req, res) => {
  res.send("Server is healthy");
});

app.listen(PORT, () => {
  console.log(`Server is Live at http://localhost:${PORT}`);
});
