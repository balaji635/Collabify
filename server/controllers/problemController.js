// controllers/problemController.js

// 1️⃣ Import the model under the name you’ll use below:
const Problem = require('../model/problemModel');

exports.createStatement = async (req, res) => {
  const {
    hackathonName,
    teamName,
    membersRequired,
    registrationDeadline,
    skillsRequired,
    description
  } = req.body;

  // Grab authenticated user ID from middleware
  const userID = req.user._id;

  if (!hackathonName || !teamName || !membersRequired || !registrationDeadline || !skillsRequired || !description) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

<<<<<<< HEAD
  try {
    // 2️⃣ Use the same `Problem` reference here:
    const problem = new Problem({
      hackathonName,
      teamName,
      membersRequired,
      registrationDeadline,
      skillsRequired,
      description,
      createdBy: userID
    });

    await problem.save();

    return res.status(201).json({ success: true, data: problem });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
=======
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
  createdBy: userID
});

await problem.save();
return res.status(201).json({ success: true, data: problem });
}
>>>>>>> 6675f71 (Add team posting logic and update backend problem controller)

exports.getAllProblems = async (req, res) => {
  try {
    // 3️⃣ And here as well:
    const problems = await Problem
      .find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: problems });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
