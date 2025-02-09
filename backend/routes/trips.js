const express = require("express");
const Trip = require("../models/Trip");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Kreiranje putnog naloga (DOSTUPNO SVIM KORISNICIMA)
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

// Dohvatanje svih putnih naloga (DOSTUPNO SVIM KORISNICIMA)
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.getAll();
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Ažuriranje statusa putnog naloga (SAMO ADMIN)
router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    console.log("Primljen zahtjev za ažuriranje statusa:", req.body);
    console.log("ID putnog naloga:", req.params.id);

    const status = String(req.body.status).trim();

    if (!['evidentiran', 'potvrđen', 'odbijen', 'završen'].includes(status)) {
      return res.status(400).json({ error: "Nevalidan status" });
    }

    const updatedTrip = await Trip.updateStatus(req.params.id, status);
    console.log("Putni nalog ažuriran:", updatedTrip);

    res.json(updatedTrip);
  } catch (err) {
    console.error("Greška pri ažuriranju statusa:", err.message);
    res.status(500).send("Server Error");
  }
});

// Brisanje putnog naloga (SAMO ADMIN)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const response = await Trip.delete(req.params.id);
    res.json(response);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;