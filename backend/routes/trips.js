const express = require("express");
const Trip = require("../models/Trip");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
      const { vehicle_id, driver_name, passengers, start_location, end_location, start_time, end_time, status } = req.body;
      
      const tripStatus = status || 'evidentiran';

      const newTrip = await Trip.create({
          vehicle_id,
          driver_name,
          passengers,
          start_location,
          end_location,
          start_time,
          end_time,
          status: tripStatus,
      });

      res.json(newTrip);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});

router.get("/", async (req, res) => {
  try {
      const trips = await Trip.getAll();
      res.json(trips);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});

const normalizeStatus = (status) => status.normalize("NFC"); // Osigurava ispravan encoding

router.put("/:id/status", async (req, res) => {
  try {
      console.log("Primljen zahtjev za ažuriranje statusa:", req.body);

      const { status } = req.body;
      const normalizedStatus = normalizeStatus(status);

      if (!['evidentiran', 'potvrđen', 'odbijen', 'završen'].includes(normalizedStatus)) {
          return res.status(400).json({ error: "Invalid status value" });
      }

      const updatedTrip = await Trip.updateStatus(req.params.id, normalizedStatus);
      res.json(updatedTrip);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});


router.delete("/:id", async (req, res) => {
  try {
      const response = await Trip.delete(req.params.id);
      res.json(response);
  } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
  }
});

module.exports = router;