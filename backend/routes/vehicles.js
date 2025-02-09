const express = require("express");
const Vehicle = require("../models/Vehicle");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    const vehicles = await Vehicle.getAll();
    res.json(vehicles);
});

router.get("/:id", authMiddleware, async (req, res) => {
    const vehicle = await Vehicle.getById(req.params.id);
    res.json(vehicle);
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const response = await Vehicle.delete(req.params.id);
    res.json(response);
});

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params;
    const vehicleData = req.body;

    try {
        const updatedVehicle = await Vehicle.update(id, vehicleData);
        if (!updatedVehicle) {
            return res.status(404).send({ error: "Vozilo nije pronađeno." });
        }
        res.json(updatedVehicle);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;