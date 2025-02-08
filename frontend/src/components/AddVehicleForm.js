import React, { useState, useEffect } from "react";
import { addVehicle, getVehicles } from "../services/api";

const AddVehicleForm = ({ onVehicleAdded }) => {
  const [vehicle, setVehicle] = useState({
    brand: "",
    model: "",
    chassis_number: "",
    engine_number: "",
    power_kw: "",
    power_hp: "",
    fuel_type: "benzin",
    production_year: "",
  });

  const [errors, setErrors] = useState({});
  const [existingVehicles, setExistingVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setExistingVehicles(data);
      } catch (error) {
        console.error("Greška pri dohvaćanju vozila:", error);
      }
    };
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    // Obavezna polja
    Object.keys(vehicle).forEach((key) => {
      if (!vehicle[key]) {
        newErrors[key] = "Ovo polje je obavezno!";
      }
    });

    // Validacija broja šasije i motora (moraju biti unikatni)
    if (existingVehicles.some((v) => v.chassis_number === vehicle.chassis_number)) {
      newErrors.chassis_number = "Broj šasije već postoji!";
    }
    if (existingVehicles.some((v) => v.engine_number === vehicle.engine_number)) {
      newErrors.engine_number = "Broj motora već postoji!";
    }

    // Godina proizvodnje (mora biti između 1900 i tekuće godine)
    const currentYear = new Date().getFullYear();
    if (vehicle.production_year < 1900 || vehicle.production_year > currentYear) {
      newErrors.production_year = `Godina proizvodnje mora biti između 1900 i ${currentYear}`;
    }

    // Snaga motora (ne može biti negativna)
    if (vehicle.power_kw < 0 || vehicle.power_hp < 0) {
      newErrors.power_kw = "Snaga ne može biti negativna!";
      newErrors.power_hp = "Snaga ne može biti negativna!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // True ako nema grešaka
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Ne šalje ako forma nije validna

    try {
      await addVehicle(vehicle);
      alert("Vozilo uspješno dodano!");
      setVehicle({
        brand: "",
        model: "",
        chassis_number: "",
        engine_number: "",
        power_kw: "",
        power_hp: "",
        fuel_type: "benzin",
        production_year: "",
      });
      setErrors({});
      onVehicleAdded();
    } catch (error) {
      console.error("Greška pri dodavanju vozila:", error.response ? error.response.data : error.message);
      alert("Došlo je do greške! " + (error.response ? error.response.data.error : error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Dodaj novo vozilo</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-gray-600 font-semibold">Marka</label>
          <input type="text" name="brand" value={vehicle.brand} onChange={handleChange} className="border p-2 rounded w-full" />
          {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Model</label>
          <input type="text" name="model" value={vehicle.model} onChange={handleChange} className="border p-2 rounded w-full" />
          {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Broj šasije</label>
          <input type="text" name="chassis_number" value={vehicle.chassis_number} onChange={handleChange} className="border p-2 rounded w-full" />
          {errors.chassis_number && <p className="text-red-500 text-sm">{errors.chassis_number}</p>}
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Broj motora</label>
          <input type="text" name="engine_number" value={vehicle.engine_number} onChange={handleChange} className="border p-2 rounded w-full" />
          {errors.engine_number && <p className="text-red-500 text-sm">{errors.engine_number}</p>}
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Snaga (kW)</label>
          <input type="number" name="power_kw" value={vehicle.power_kw} onChange={handleChange} className="border p-2 rounded w-full" />
          {errors.power_kw && <p className="text-red-500 text-sm">{errors.power_kw}</p>}
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Snaga (HP)</label>
          <input type="number" name="power_hp" value={vehicle.power_hp} onChange={handleChange} className="border p-2 rounded w-full" />
          {errors.power_hp && <p className="text-red-500 text-sm">{errors.power_hp}</p>}
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Vrsta goriva</label>
          <select name="fuel_type" value={vehicle.fuel_type} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="benzin">Benzin</option>
            <option value="dizel">Dizel</option>
            <option value="plin">Plin</option>
          </select>
          {errors.fuel_type && <p className="text-red-500 text-sm">{errors.fuel_type}</p>}
        </div>

        <div>
          <label className="text-gray-600 font-semibold">Godina proizvodnje</label>
          <input type="number" name="production_year" value={vehicle.production_year} onChange={handleChange} className="border p-2 rounded w-full" />
          {errors.production_year && <p className="text-red-500 text-sm">{errors.production_year}</p>}
        </div>
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-6 w-full text-lg shadow-md">
        Dodaj vozilo
      </button>
    </form>
  );
};

export default AddVehicleForm;