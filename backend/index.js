const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db");

dotenv.config();

const app = express();
const vehicleRoutes = require("./routes/vehicles");
const tripRoutes = require("./routes/trips");
const reportsRoutes = require("./routes/reports");


app.use(cors());
app.use(express.json());

app.use("/api/vehicles", vehicleRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/reports", reportsRoutes);

app.get("/", (req, res) => {
  res.send("Fleet Management API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));