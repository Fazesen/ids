const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
    const token = req.headers["authorization"];

    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        // Check if user still exists in DB
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ error: "User no longer exists" });

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
