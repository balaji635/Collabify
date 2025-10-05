// controllers/problemController.js

const Problem = require('../model/problemModel');


exports.createStatement = async (req, res) => {
  try {
    const {
      hackathonName,
      teamName,
      membersRequired,
      registrationDeadline,
      skillsRequired,
      description
    } = req.body;

   
    if (!hackathonName || !teamName || !membersRequired || !registrationDeadline || !skillsRequired || !description) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

  
    const existingTeam = await Problem.findOne({ teamName: teamName.toUpperCase() });
    if (existingTeam) {
      return res.status(400).json({ success: false, message: "Team with this name already exists." });
    }

  
    const problem = new Problem({
      hackathonName,
      teamName: teamName.toUpperCase(),
      membersRequired,
      registrationDeadline,
      skillsRequired,
      description,
      createdBy: req.user._id
    });

    await problem.save();
    return res.status(201).json({ success: true, data: problem });
  } catch (err) {
    console.error("Error in createStatement:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};


exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem
      .find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: problems });
  } catch (err) {
    console.error("Error in getAllProblems:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};


exports.deleteProblem = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    // Find the post
    const post = await Problem.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

   
    if (post.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized." });
    }

    
    await Problem.findByIdAndDelete(postId);
    return res.json({ success: true, message: "Post deleted successfully." });
  } catch (err) {
    console.error("Error in deleteProblem:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
