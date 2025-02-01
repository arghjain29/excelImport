require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const excelRoutes = require("./routes/excelRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
app.use("/api", excelRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
