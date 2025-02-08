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

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVehicle(vehicle);
      alert("Vozilo uspješno dodano!");
      setVehicle({
        brand: "",
        model: "",
        chassis_number: "",
        engine_number: "",
        power_kw: "",
        power_hp: "", // Ispravljeno, dodano nazad
        fuel_type: "benzin",
        production_year: "",
      });
      onVehicleAdded();
    } catch (error) {
      console.error("Greška pri dodavanju vozila:", error);
      alert("Došlo je do greške!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-2">
      <h2 className="text-2xl font-bold mb-4">Dodaj novo vozilo</h2>
      <input type="text" name="brand" placeholder="Marka" value={vehicle.brand} onChange={handleChange} required className="border p-2 rounded" />
      <input type="text" name="model" placeholder="Model" value={vehicle.model} onChange={handleChange} required className="border p-2 rounded" />
      <input type="text" name="chassis_number" placeholder="Broj šasije" value={vehicle.chassis_number} onChange={handleChange} required className="border p-2 rounded" />
      <input type="text" name="engine_number" placeholder="Broj motora" value={vehicle.engine_number} onChange={handleChange} required className="border p-2 rounded" />
      <input type="number" name="power_kw" placeholder="Snaga (kW)" value={vehicle.power_kw} onChange={handleChange} required className="border p-2 rounded" />
      <input type="number" name="power_hp" placeholder="Snaga (HP)" value={vehicle.power_hp} onChange={handleChange} required className="border p-2 rounded" /> {/* Dodano nazad */}
      <select name="fuel_type" value={vehicle.fuel_type} onChange={handleChange} className="border p-2 rounded">
        <option value="benzin">Benzin</option>
        <option value="dizel">Dizel</option>
        <option value="plin">Plin</option>
      </select>
      <input type="number" name="production_year" placeholder="Godina proizvodnje" value={vehicle.production_year} onChange={handleChange} required className="border p-2 rounded" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Dodaj vozilo</button>
    </form>
  );
};

export default AddVehicleForm;
