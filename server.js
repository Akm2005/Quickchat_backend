const express = require("express");
const dotenv = require("dotenv");
const indexroute = require("./routes/index");
const pool = require('./config/db');
dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/v1", indexroute);
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ PostgreSQL Connection Error: ", err.message));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
