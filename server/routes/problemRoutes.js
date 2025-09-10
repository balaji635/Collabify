const express = require("express");
const {
  createStatement,
  getAllProblems,
  deleteProblem,
} = require("../controllers/problemController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-problem", authMiddleware, createStatement);
router.get("/all", authMiddleware, getAllProblems);
// router.get('/your-posts', authMiddleware, getYourProblems);
router.delete("/:id", authMiddleware, deleteProblem);

module.exports = router;
