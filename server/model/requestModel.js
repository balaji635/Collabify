
const mongoose = require("mongoose");
const requestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
post: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true }, // 👈 link to the exact post
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
}, { timestamps: true });
const Request = mongoose.model("Request", requestSchema);
module.exports = Request;
