const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Registracija (samo za inicijalnog admina)
router.post("/register", async (req, res) => {
    const { username, password, role } = req.body;

    if (role !== "admin") {
        return res.status(403).json({ error: "Samo admin može biti registrovan ručno." });
    }

    try {
        const existingUser = await User.getByUsername(username);
        if (existingUser) return res.status(400).json({ error: "Korisničko ime već postoji." });

        const newUser = await User.create({ username, password, role });
        res.status(201).json({ message: "Admin registrovan!", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login (kreira i vraća JWT token)
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.getByUsername(username);
        if (!user) return res.status(400).json({ error: "Pogrešno korisničko ime ili lozinka." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Pogrešno korisničko ime ili lozinka." });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2h" });

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;