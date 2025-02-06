const express = require("express");
const Trip = require("../models/Trip");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const trips = await Trip.getAll();
  res.json(trips);
});

router.put("/:id/status", async (req, res) => {
  const trip = await Trip.updateStatus(req.params.id, req.body.status);
  res.json(trip);
});

router.delete("/:id", async (req, res) => {
  const response = await Trip.delete(req.params.id);
  res.json(response);
});

module.exports = router;