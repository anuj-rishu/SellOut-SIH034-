const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require('./routes/bookingRoutes');

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/booking', bookingRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
