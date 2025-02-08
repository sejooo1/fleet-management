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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      onTripAdded();
    } catch (error) {
      console.error("Greška pri dodavanju putnog naloga:", error);
      alert("Došlo je do greške!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Dodaj novi putni nalog</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-gray-600">Ime vozača</label>
          <input type="text" name="driver_name" placeholder="Unesite ime" value={trip.driver_name} onChange={handleChange} required className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="text-gray-600">Broj putnika</label>
          <input type="number" name="passengers" placeholder="Broj putnika" value={trip.passengers} onChange={handleChange} required className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="text-gray-600">Polazna lokacija</label>
          <input type="text" name="start_location" placeholder="Unesite polaznu lokaciju" value={trip.start_location} onChange={handleChange} required className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="text-gray-600">Dolazna lokacija</label>
          <input type="text" name="end_location" placeholder="Unesite dolaznu lokaciju" value={trip.end_location} onChange={handleChange} required className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="text-gray-600">Početak perioda iznajmljivanja vozila</label>
          <input type="datetime-local" name="start_time" value={trip.start_time} onChange={handleChange} required className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="text-gray-600">Kraj perioda iznajmljivanja vozila</label>
          <input type="datetime-local" name="end_time" value={trip.end_time} onChange={handleChange} required className="border p-2 rounded w-full" />
        </div>

        <div className="col-span-2">
          <label className="text-gray-600">Odaberite vozilo</label>
          <select
            name="vehicle_id"
            value={trip.vehicle_id}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          >
            <option value="">-- Odaberite vozilo --</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.brand} {vehicle.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded mt-6 w-full text-lg">
        Dodaj putni nalog
      </button>
    </form>
  );
};

export default AddTripForm;