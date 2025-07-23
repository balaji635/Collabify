const express = require('express');
const { createStatement, getAllProblems,deleteProblem } = require('../controllers/problemController');
const { userCookies } = require('../middleware/userCookies');

const router = express.Router();

router.post('/create-problem', userCookies, createStatement);
router.get('/all', userCookies, getAllProblems);  // <-- this must exist
router.delete('/:id', userCookies, deleteProblem);

module.exports = router;
