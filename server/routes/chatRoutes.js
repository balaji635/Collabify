const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getRequests,
  getSentRequests,
  getMyChats,
  sendMessage,
  getMessages,
  cancelRequest
} = require("../controllers/chatController");

// Request routes
router.get("/requests", authMiddleware, getRequests);
router.get("/sent-requests", authMiddleware, getSentRequests);
router.post("/request", authMiddleware, sendRequest); // FIXED: This handles the request sending
router.post("/requests/:id/accept", authMiddleware, acceptRequest); // FIXED: separate accept endpoint
router.post("/requests/:id/reject", authMiddleware, rejectRequest); // FIXED: separate reject endpoint
router.delete("/requests/:id", authMiddleware, cancelRequest);


router.get("/my-chats", authMiddleware, getMyChats);
router.get("/messages/:chatId", authMiddleware, getMessages);
router.post("/message", authMiddleware, sendMessage); // FIXED: This handles message sending

module.exports = router;