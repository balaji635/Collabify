const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./utiles/dbUtiles");
const { createServer } = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const chatRoutes = require("./routes/chatRoutes");
const Message = require("./model/messageModel");

const app = express();
const port = process.env.PORT || 4000;
const server = createServer(app);

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


app.use("/api/auth", authRoutes);
app.use("/problem", problemRoutes);
app.use("/chat", chatRoutes);

// Socket.IO - FIXED
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  // Handle message sending via socket
  socket.on("sendMessage", ({ chatId, message }) => {
    // Just broadcast the message to the chat room
    // Don't create a new message here - that's handled by the API endpoint
    io.to(chatId).emit("receiveMessage", message);
  });

  // Handle user joining a room (for notifications)
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room`);
  });

  // Handle new request notifications
  socket.on("newRequest", (toUserId) => {
    io.to(toUserId).emit("newRequest");
  });

  // Handle request action notifications
  socket.on("requestAction", ({ requestId, action }) => {
    io.emit("requestAction", { requestId, action });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});