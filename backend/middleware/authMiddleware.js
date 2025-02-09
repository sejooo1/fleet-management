const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Pristup odbijen. Nema tokena ili je neispravno formatiran." });
}

try {
    const verified = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
} catch (err) {
    return res.status(403).json({ error: "Neispravan token." });
}

};

// Middleware za provjeru admin pristupa
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Pristup odbijen. Niste administrator." });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };