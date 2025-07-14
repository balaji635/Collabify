const jwt = require('jsonwebtoken');

exports.userCookies = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        console.log("❌ No token found in cookies");
        return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token decoded:", tokenDecoded);

        if (!tokenDecoded || !tokenDecoded.id) {
            console.log("❌ Token decoded but `id` missing");
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
        }

        req.body = req.body || {};
        req.body.userID = tokenDecoded.id;
        console.log("✅ Middleware passed, userID set:", tokenDecoded.id);
        next();
    } catch (error) {
        console.log("❌ JWT verification failed:", error.message);
        return res.status(401).json({ success: false, message: "Unauthorized: Token verification failed" });
    }
};
