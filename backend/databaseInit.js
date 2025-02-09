const pool = require("./db");

const createTables = async () => {
  try {
    // Kreiranje tabele korisnika
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user'))
      );
    `);

    // Kreiranje tabele vozila
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        brand VARCHAR(50) NOT NULL,
        model VARCHAR(50) NOT NULL,
        chassis_number VARCHAR(50) UNIQUE NOT NULL,
        engine_number VARCHAR(50) UNIQUE NOT NULL,
        power_kw INT NOT NULL,
        power_hp INT NOT NULL,
        fuel_type VARCHAR(20) NOT NULL CHECK (fuel_type IN ('benzin', 'dizel', 'plin')),
        production_year INT NOT NULL
      );
    `);

    // Kreiranje tabele putnih naloga
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id SERIAL PRIMARY KEY,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        driver_name VARCHAR(100) NOT NULL,
        passengers INT NOT NULL,
        start_location TEXT NOT NULL,
        end_location TEXT NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('evidentiran', 'potvrđen', 'odbijen', 'završen'))
      );
    `);

    console.log("Tables created successfully!");
    process.exit();
  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1);
  }
};

createTables();