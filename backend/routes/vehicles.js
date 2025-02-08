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
  try {
    const { id } = req.params;
    const { brand, model, chassis_number, engine_number, power_kw, power_hp, fuel_type, production_year } = req.body;

    const updatedVehicle = await pool.query(
      "UPDATE vehicles SET brand=$1, model=$2, chassis_number=$3, engine_number=$4, power_kw=$5, power_hp=$6, fuel_type=$7, production_year=$8 WHERE id=$9 RETURNING *",
      [brand, model, chassis_number, engine_number, power_kw, power_hp, fuel_type, production_year, id]
    );

    if (updatedVehicle.rows.length === 0) {
      return res.status(404).json({ error: "Vozilo nije pronađeno" });
    }

    res.json(updatedVehicle.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


module.exports = router;