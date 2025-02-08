const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/usage", async (req, res) => {
    const { vehicle_id, start_date, end_date } = req.query;

    if (!vehicle_id || !start_date || !end_date) {
        return res.status(400).json({ error: "Svi parametri su obavezni." });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM trips 
             WHERE vehicle_id = $1 
             AND start_time >= $2 
             AND end_time <= $3`,
            [vehicle_id, start_date, end_date]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Greška u upitu za izvještaj:", error);
        res.status(500).json({ error: "Greška na serveru." });
    }
});

module.exports = router;