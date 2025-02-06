const pool = require("../db");

class Trip {
  static async create({ vehicle_id, driver_name, passengers, start_location, end_location, start_time, end_time, status }) {
    const result = await pool.query(
      `INSERT INTO trips (vehicle_id, driver_name, passengers, start_location, end_location, start_time, end_time, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [vehicle_id, driver_name, passengers, start_location, end_location, start_time, end_time, status]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query(`SELECT * FROM trips`);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const result = await pool.query(
      `UPDATE trips SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query(`DELETE FROM trips WHERE id = $1`, [id]);
    return { message: "Trip deleted" };
  }
}

module.exports = Trip;
