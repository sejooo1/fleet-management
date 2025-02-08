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

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const vehicleData = req.body;

  try {
    console.log("Primljen zahtjev za ažuriranje vozila:", id, vehicleData);

    // Pozovi update metodu iz modela
    const updatedVehicle = await Vehicle.update(id, vehicleData);

    if (!updatedVehicle) {
      return res.status(404).send({ error: "Vozilo nije pronađeno." });
    }

    console.log("Vozilo ažurirano:", updatedVehicle);
    res.json(updatedVehicle);
  } catch (err) {
    console.error("Greška pri ažuriranju vozila:", err);
    res.status(500).send({ error: err.message });
  }
});




module.exports = router;