const jwt = require('jsonwebtoken');

exports.authMiddleware = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }

    req.user = { _id: decoded.id }; // ✅ set authenticated user
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token verification failed" });
  }
};
