const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const db = require("./src/db/db");
const express = require("express");
const { notFound, errorHandler } = require("./src/middleware/error-handler");

const PORT = 8000;
const app = express();

db.connectDB();

// .then(() => {
//   seedSidebar().catch((err) => {
//     console.error("Error seeding sidebar:", err);
//     // process.exit(1);
//   });
// });

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

require("./src/routes/index")(app);
require("./src/models/index");

app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Server is healthy");
});

app.listen(PORT, () => {
  console.log(`Server is Live at http://localhost:${PORT}`);
});
