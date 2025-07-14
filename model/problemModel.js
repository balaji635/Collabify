const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  hackathonName: {
    type: String,
    required: true,
    trim: true,
  },
  teamName: {
    type: String,
    required: true,
    trim: true,
  },
  membersRequired: {
    type: Number,
    required: true,
    min: 1,
  },
  registrationDeadline: {
    type: Date,
    required: true,
  },
  skillsRequired: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming your user model is named 'User'
    required: true,
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const problemModel = mongoose.models.problems || mongoose.model('problems', problemSchema);

module.exports = problemModel