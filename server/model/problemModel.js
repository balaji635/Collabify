const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  hackathonName:       { type: String, required: true, trim: true },
  teamName:            { type: String, required: true, trim: true },
  membersRequired:     { type: Number, required: true, min: 1 },
  registrationDeadline:{ type: Date,   required: true },
  skillsRequired:      { type: [String], required: true },
  description:         { type: String, default: "" },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',     // must match the User model name exactly
    required: true,
  },
}, {
  timestamps: true
});

const Problem = mongoose.models.Problem || mongoose.model('Problem', problemSchema);

module.exports = Problem;
