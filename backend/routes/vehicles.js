const express = require("express");
const Vehicle = require("../models/Vehicle");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// 🟢 Dozvoli svima da vide listu vozila
router.get("/", async (req, res) => {
    try {
        const vehicles = await Vehicle.getAll();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🟢 Dozvoli svima da vide detalje vozila
router.get("/:id", async (req, res) => {
    try {
        const vehicle = await Vehicle.getById(req.params.id);
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔒 Samo admin može dodati vozilo
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔒 Samo admin može obrisati vozilo
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const response = await Vehicle.delete(req.params.id);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔒 Samo admin može ažurirati vozilo
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const vehicleData = req.body;

    try {
        const updatedVehicle = await Vehicle.update(id, vehicleData);
        if (!updatedVehicle) {
            return res.status(404).send({ error: "Vozilo nije pronađeno." });
        }
        res.json(updatedVehicle);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;