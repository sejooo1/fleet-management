const express = require("express");
const Vehicle = require("../models/Vehicle");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const vehicles = await Vehicle.getAll();
  res.json(vehicles);
});

router.get("/:id", async (req, res) => {
  const vehicle = await Vehicle.getById(req.params.id);
  res.json(vehicle);
});

router.delete("/:id", async (req, res) => {
  const response = await Vehicle.delete(req.params.id);
  res.json(response);
});

module.exports = router;