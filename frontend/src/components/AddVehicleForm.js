import React, { useState } from "react";
import { addVehicle } from "../services/api";

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

  const [errors, setErrors] = useState({}); // Drži greške validacije

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    Object.keys(vehicle).forEach((key) => {
      if (!vehicle[key]) {
        newErrors[key] = "Ovo polje je obavezno!";
      }
    });

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
      setErrors({}); // Resetuje greške
      onVehicleAdded();
    } catch (error) {
      console.error("Greška pri dodavanju vozila:", error.response ? error.response.data : error.message);
      alert("Došlo je do greške! " + (error.response ? error.response.data.error : error.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-2">
      <h2 className="text-2xl font-bold mb-4">Dodaj novo vozilo</h2>

      <div>
        <input type="text" name="brand" placeholder="Marka" value={vehicle.brand} onChange={handleChange} className="border p-2 rounded w-full" />
        {errors.brand && <p className="text-red-500 text-sm">{errors.brand}</p>}
      </div>

      <div>
        <input type="text" name="model" placeholder="Model" value={vehicle.model} onChange={handleChange} className="border p-2 rounded w-full" />
        {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
      </div>

      <div>
        <input type="text" name="chassis_number" placeholder="Broj šasije" value={vehicle.chassis_number} onChange={handleChange} className="border p-2 rounded w-full" />
        {errors.chassis_number && <p className="text-red-500 text-sm">{errors.chassis_number}</p>}
      </div>

      <div>
        <input type="text" name="engine_number" placeholder="Broj motora" value={vehicle.engine_number} onChange={handleChange} className="border p-2 rounded w-full" />
        {errors.engine_number && <p className="text-red-500 text-sm">{errors.engine_number}</p>}
      </div>

      <div>
        <input type="number" name="power_kw" placeholder="Snaga (kW)" value={vehicle.power_kw} onChange={handleChange} className="border p-2 rounded w-full" />
        {errors.power_kw && <p className="text-red-500 text-sm">{errors.power_kw}</p>}
      </div>

      <div>
        <input type="number" name="power_hp" placeholder="Snaga (HP)" value={vehicle.power_hp} onChange={handleChange} className="border p-2 rounded w-full" />
        {errors.power_hp && <p className="text-red-500 text-sm">{errors.power_hp}</p>}
      </div>

      <div>
        <select name="fuel_type" value={vehicle.fuel_type} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="benzin">Benzin</option>
          <option value="dizel">Dizel</option>
          <option value="plin">Plin</option>
        </select>
        {errors.fuel_type && <p className="text-red-500 text-sm">{errors.fuel_type}</p>}
      </div>

      <div>
        <input type="number" name="production_year" placeholder="Godina proizvodnje" value={vehicle.production_year} onChange={handleChange} className="border p-2 rounded w-full" />
        {errors.production_year && <p className="text-red-500 text-sm">{errors.production_year}</p>}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Dodaj vozilo
      </button>
    </form>
  );
};

export default AddVehicleForm;