// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const connectDB = require('./utiles/dbUtiles');

const authRoutes = require('./routes/authRoutes');
const problemRoutes = require('./routes/problemRoutes');

const app = express();
const port = process.env.PORT || 4000;

connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
}));

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// 🔥 Mount here so frontend can call /api/auth/verify, /api/auth/login, etc.
app.use("/api/auth", authRoutes);

// Problem endpoints remain at /problem
app.use("/problem", problemRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
