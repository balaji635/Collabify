const Chat = require("../model/chatModel");
const Message = require("../model/messageModel");
const Request = require("../model/requestModel");
const Post = require("../model/problemModel");


exports.sendRequest = async (req, res) => {
  try {
    const { postId } = req.body;

    const post = await Post.findById(postId).populate("createdBy");
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

   
    if (post.createdBy._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot request your own post" });
    }

    
    const existing = await Request.findOne({
      from: req.user._id,
      post: post._id,
      status: "pending"
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "You already have a pending request for this post" });
    }

    const request = await Request.create({
      from: req.user._id,
      to: post.createdBy._id,
      post: post._id,
    });

    const populatedRequest = await Request.findById(request._id)
      .populate("from", "name email")
      .populate("to", "name email")
      .populate("post", "hackathonName teamName");

    return res.json({ success: true, request: populatedRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


exports.acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (request.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    request.status = "accepted";
    await request.save();

    // Create or find existing chat between these two users
    let chat = await Chat.findOne({ 
      users: { $all: [request.from, request.to] }
    });
    
    if (!chat) {
      chat = new Chat({ users: [request.from, request.to] });
      await chat.save();
    }

    // Populate chat with user details
    const populatedChat = await Chat.findById(chat._id).populate("users", "name email");

    res.json({ success: true, chat: populatedChat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (request.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    request.status = "rejected";
    await request.save();
    res.json({ success: true, request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all incoming requests - FIXED
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find({ to: req.user._id, status: "pending" })
      .populate("from", "name email")
      .populate("to", "name email")
      .populate("post", "hackathonName teamName");

    res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getSentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ from: req.user._id, status: "pending" })
      .populate("from", "name email")
      .populate("to", "name email")
      .populate("post", "hackathonName teamName");

    res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: req.user._id }).populate("users", "name email");
    res.json({ success: true, chats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Message content is required" });
    }

    const message = new Message({ 
      chat: chatId, 
      sender: req.user._id, 
      content: content.trim()
    });
    await message.save();

    const populatedMessage = await Message.findById(message._id).populate("sender", "name email");
    res.json({ success: true, message: populatedMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 }); // Sort by creation time ascending

    res.json({ success: true, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cancel/unsend a request 
exports.cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    if (request.from.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Request.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Request cancelled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
