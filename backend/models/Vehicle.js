const pool = require("../db");

class Vehicle {
  static async create({ brand, model, chassis_number, engine_number, power_kw, power_hp, fuel_type, production_year }) {
    const result = await pool.query(
      `INSERT INTO vehicles (brand, model, chassis_number, engine_number, power_kw, power_hp, fuel_type, production_year)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [brand, model, chassis_number, engine_number, power_kw, power_hp, fuel_type, production_year]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [id]);
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
    return { message: "Vehicle deleted" };
  }
}

module.exports = Vehicle;