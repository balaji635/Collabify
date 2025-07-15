// model/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
  // any other fields…
}, {
  timestamps: true
});

// Register under the name "User"
const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
