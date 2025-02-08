const express = require("express");
const Trip = require("../models/Trip");
const router = express.Router();

router.post("/", async (req, res) => {
  const { vehicle_id, driver_name, passengers, start_location, end_location, start_time, end_time } = req.body;

  if (!vehicle_id || !driver_name || !start_time || !end_time) {
    return res.status(400).json({ error: "Svi podaci su obavezni." });
  }

  try {
    // Provjera da li postoji rezervacija u preklapajućem periodu
    const conflictTrips = await Trip.checkConflict(vehicle_id, start_time, end_time);

    if (conflictTrips.length > 0) {
      return res.status(400).json({ error: "Vozilo je već rezervisano u ovom periodu." });
    }

    // Ako nema konflikta, dodaj novi putni nalog
    const newTrip = await Trip.create({
      vehicle_id,
      driver_name,
      passengers,
      start_location,
      end_location,
      start_time,
      end_time,
      status: "evidentiran",
    });

    res.json(newTrip);
  } catch (error) {
    console.error("Greška pri dodavanju putnog naloga:", error);
    res.status(500).json({ error: "Greška na serveru." });
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

router.put("/:id/status", async (req, res) => {
  try {
      console.log("Primljen zahtjev za ažuriranje statusa:", req.body);
      console.log("ID putnog naloga:", req.params.id);

      const status = String(req.body.status).trim(); // Osigurava da status bude string

      if (!['evidentiran', 'potvrđen', 'odbijen', 'završen'].includes(status)) {
          return res.status(400).json({ error: "Invalid status value" });
      }

      const updatedTrip = await Trip.updateStatus(req.params.id, status);
      console.log("Putni nalog ažuriran:", updatedTrip);

      res.json(updatedTrip);
  } catch (err) {
      console.error("Greška pri ažuriranju statusa:", err.message);
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