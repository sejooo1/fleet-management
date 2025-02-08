import React, { useState, useEffect } from "react";
import { getVehicles, addTrip } from "../services/api";

const AddTripForm = ({ onTripAdded }) => {
  const [trip, setTrip] = useState({
    driver_name: "",
    passengers: "",
    start_location: "",
    end_location: "",
    start_time: "",
    end_time: "",
    vehicle_id: "",
  });

  const [vehicles, setVehicles] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicles(data);
      } catch (error) {
        console.error("Greška pri dohvaćanju vozila:", error);
      }
    };

    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};

    // Obavezna polja
    Object.keys(trip).forEach((key) => {
      if (!trip[key]) {
        newErrors[key] = "Ovo polje je obavezno!";
      }
    });

    // Početak perioda mora biti prije kraja
    if (trip.start_time && trip.end_time && trip.start_time >= trip.end_time) {
      newErrors.start_time = "Početni datum mora biti prije krajnjeg datuma.";
      newErrors.end_time = "Krajnji datum mora biti nakon početnog.";
    }

    // Broj putnika mora biti pozitivan broj
    if (trip.passengers && (isNaN(trip.passengers) || trip.passengers <= 0)) {
      newErrors.passengers = "Broj putnika mora biti veći od 0.";
    }

    // Ime vozača mora sadržavati samo slova i razmake
    if (trip.driver_name && !/^[A-Za-zčćžšđ\s]+$/.test(trip.driver_name)) {
      newErrors.driver_name = "Ime vozača smije sadržavati samo slova i razmak.";
    }

    // Polazna i dolazna lokacija ne mogu biti iste
    if (trip.start_location && trip.end_location && trip.start_location === trip.end_location) {
      newErrors.end_location = "Dolazna lokacija mora biti različita od polazne.";
    }

    // Vozilo mora biti odabrano
    if (!trip.vehicle_id) {
      newErrors.vehicle_id = "Morate odabrati vozilo.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setServerError("");

    try {
      await addTrip({ ...trip, status: "evidentiran" });
      alert("Putni nalog uspješno dodan!");

      setTrip({
        driver_name: "",
        passengers: "",
        start_location: "",
        end_location: "",
        start_time: "",
        end_time: "",
        vehicle_id: "",
      });

      setErrors({});
      onTripAdded();
    } catch (error) {
      console.error("Greška pri dodavanju putnog naloga:", error);
      setServerError(error.response?.data?.error || "Došlo je do greške!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Dodaj novi putni nalog</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-gray-600">Ime vozača</label>
          <input
            type="text"
            name="driver_name"
            placeholder="Unesite ime"
            value={trip.driver_name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.driver_name && <p className="text-red-500 text-sm">{errors.driver_name}</p>}
        </div>

        <div>
          <label className="text-gray-600">Broj putnika</label>
          <input
            type="number"
            name="passengers"
            placeholder="Broj putnika"
            value={trip.passengers}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.passengers && <p className="text-red-500 text-sm">{errors.passengers}</p>}
        </div>

        <div>
          <label className="text-gray-600">Polazna lokacija</label>
          <input
            type="text"
            name="start_location"
            placeholder="Unesite polaznu lokaciju"
            value={trip.start_location}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.start_location && <p className="text-red-500 text-sm">{errors.start_location}</p>}
        </div>

        <div>
          <label className="text-gray-600">Dolazna lokacija</label>
          <input
            type="text"
            name="end_location"
            placeholder="Unesite dolaznu lokaciju"
            value={trip.end_location}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.end_location && <p className="text-red-500 text-sm">{errors.end_location}</p>}
        </div>

        <div>
          <label className="text-gray-600">Početak perioda iznajmljivanja vozila</label>
          <input
            type="datetime-local"
            name="start_time"
            value={trip.start_time}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.start_time && <p className="text-red-500 text-sm">{errors.start_time}</p>}
        </div>

        <div>
          <label className="text-gray-600">Kraj perioda iznajmljivanja vozila</label>
          <input
            type="datetime-local"
            name="end_time"
            value={trip.end_time}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          {errors.end_time && <p className="text-red-500 text-sm">{errors.end_time}</p>}
        </div>

        <div className="col-span-2">
          <label className="text-gray-600">Odaberite vozilo</label>
          <select
            name="vehicle_id"
            value={trip.vehicle_id}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">-- Odaberite vozilo --</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model}
              </option>
            ))}
          </select>
          {errors.vehicle_id && <p className="text-red-500 text-sm">{errors.vehicle_id}</p>}
        </div>
      </div>

      {serverError && <p className="text-red-500 mt-2">{serverError}</p>}

      <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded mt-6 w-full text-lg">
        Dodaj putni nalog
      </button>
    </form>
  );
};

export default AddTripForm;