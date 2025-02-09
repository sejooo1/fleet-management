import React, { useState, useEffect } from "react";
import { addVehicle, getVehicles } from "../services/api";
import { getCurrentUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = getCurrentUser();
    setUser(loggedInUser);

    if (!loggedInUser || loggedInUser.role !== "admin") {
      navigate("/"); // Ako nije admin, preusmjeri na početnu
    }

    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setExistingVehicles(data);
      } catch (error) {
        console.error("Greška pri dohvaćanju vozila:", error);
      }
    };
    fetchVehicles();
  }, [navigate]);

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

    if (existingVehicles.some((v) => v.chassis_number === vehicle.chassis_number)) {
      newErrors.chassis_number = "Broj šasije već postoji!";
    }
    if (existingVehicles.some((v) => v.engine_number === vehicle.engine_number)) {
      newErrors.engine_number = "Broj motora već postoji!";
    }

    const currentYear = new Date().getFullYear();
    if (vehicle.production_year < 1900 || vehicle.production_year > currentYear) {
      newErrors.production_year = `Godina proizvodnje mora biti između 1900 i ${currentYear}`;
    }

    if (vehicle.power_kw < 0 || vehicle.power_hp < 0) {
      newErrors.power_kw = "Snaga ne može biti negativna!";
      newErrors.power_hp = "Snaga ne može biti negativna!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-700 text-lg">Provjera pristupa...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Dodaj novo vozilo</h2>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Marka", name: "brand" },
          { label: "Model", name: "model" },
          { label: "Broj šasije", name: "chassis_number" },
          { label: "Broj motora", name: "engine_number" },
          { label: "Snaga (kW)", name: "power_kw" },
          { label: "Snaga (HP)", name: "power_hp" },
          { label: "Godina proizvodnje", name: "production_year" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="text-gray-600 font-semibold">{label}</label>
            <input
              type={name.includes("power") || name === "production_year" ? "number" : "text"}
              name={name}
              value={vehicle[name]}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
          </div>
        ))}

        <div>
          <label className="text-gray-600 font-semibold">Vrsta goriva</label>
          <select name="fuel_type" value={vehicle.fuel_type} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="benzin">Benzin</option>
            <option value="dizel">Dizel</option>
            <option value="plin">Plin</option>
          </select>
        </div>
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-6 w-full text-lg shadow-md">
        Dodaj vozilo
      </button>
    </form>
  );
};

export default AddVehicleForm;