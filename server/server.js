require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const router = require("./routes/serverRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
