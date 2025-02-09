const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Pristup odbijen. Nema tokena." });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Dodaje korisničke podatke u req objekt
        next();
    } catch (err) {
        res.status(400).json({ error: "Neispravan token." });
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