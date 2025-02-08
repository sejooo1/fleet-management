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
  const { brand, model, chassis_number, engine_number, power_kw, power_hp, fuel_type, production_year } = req.body;

  try {
      console.log("Primljen zahtjev za ažuriranje vozila:");
      console.log("ID:", id);
      console.log("Podaci:", req.body);

      // Provjera da li vozilo postoji
      const existingVehicle = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);
      if (existingVehicle.rows.length === 0) {
          console.error("Greška: Vozilo ne postoji u bazi.");
          return res.status(404).send({ error: "Vozilo nije pronađeno." });
      }

      // Update upit
      const updatedVehicle = await pool.query(
          "UPDATE vehicles SET brand=$1, model=$2, chassis_number=$3, engine_number=$4, power_kw=$5, power_hp=$6, fuel_type=$7, production_year=$8 WHERE id=$9 RETURNING *",
          [brand, model, chassis_number, engine_number, power_kw, power_hp, fuel_type, production_year, id]
      );

      console.log("Vozilo ažurirano:", updatedVehicle.rows[0]);
      res.json(updatedVehicle.rows[0]);
  } catch (err) {
      console.error("Greška pri ažuriranju vozila:", err);
      res.status(500).send({ error: err.message });
  }
});



module.exports = router;