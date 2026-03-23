const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
const bugRoutes = require('./src/routes/bugRoutes');
app.use('/api/bugs', bugRoutes);

const authRoutes = require("./src/routes/authRoutes");
app.use('/api/auth', authRoutes);

// Static Image Hosting
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB
const sequelize = require('./src/config/database');
sequelize.sync({ alter: true })
  .then(() => console.log("✅ Database synced and altered"))
  .catch(err => console.error("❌ DB sync error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Bug Tracking Backend Running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});