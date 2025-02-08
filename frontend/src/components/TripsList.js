import React, { useEffect, useState } from "react";
import { getTrips, deleteTrip, updateTripStatus } from "../services/api";
import AddTripForm from "./AddTripForm";

const TripsList = () => {
  const [trips, setTrips] = useState([]);

  const fetchTrips = async () => {
    const data = await getTrips();
    setTrips(data);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Da li ste sigurni da želite obrisati ovaj putni nalog?")) {
      await deleteTrip(id);
      fetchTrips();
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateTripStatus(id, newStatus);
    fetchTrips();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Lista putnih naloga</h1>
      <AddTripForm onTripAdded={fetchTrips} />
      <ul className="mt-4">
        {trips.map((trip) => (
          <li key={trip.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-2">
            <div>
              <p><strong>Vozač:</strong> {trip.driver_name}</p>
              <p><strong>Broj putnika:</strong> {trip.passengers}</p>
              <p><strong>Od:</strong> {trip.start_location}</p>
              <p><strong>Do:</strong> {trip.end_location}</p>
              <p><strong>Status:</strong> {trip.status}</p>
            </div>
            <div>
              <select
                value={trip.status}
                onChange={(e) => handleStatusChange(trip.id, e.target.value)}
                className="border p-2 rounded"
              >
                <option value="evidentiran">Evidentiran</option>
                <option value="potvrđen">Potvrđen</option>
                <option value="odbijen">Odbijen</option>
                <option value="završen">Završen</option>
              </select>
              <button onClick={() => handleDelete(trip.id)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">
                Obriši
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripsList;