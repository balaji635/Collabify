// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/userController');
const { userCookies } = require('../middleware/userCookies');
const userModel = require('../model/userModel');

const router = express.Router();

// Registration & login
router.post('/register', authController.getRegister);
router.post('/login', authController.getLogin);

// ✅ Verify token & return user (used by frontend on refresh)
router.get('/verify', userCookies, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select('-password');
    if (!user) throw new Error();
    res.json({ success: true, user });
  } catch {
    res.status(401).json({ success: false });
  }
});

// ✅ Logout clears cookie
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
});

module.exports = router;
