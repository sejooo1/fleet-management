import React, { useEffect, useState } from "react";
import { getTrips, updateTripStatus, deleteTrip, getVehicles } from "../services/api";
import { Link } from "react-router-dom";

const formatDateTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const TripsList = () => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [expandedTrip, setExpandedTrip] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "start_time", direction: "desc" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tripData = await getTrips();
      const vehicleData = await getVehicles();
      setTrips(tripData);
      setVehicles(vehicleData);
    } catch (error) {
      console.error("Greška pri dohvaćanju podataka:", error);
    }
  };

  const toggleDetails = (tripId) => {
    if (editingStatus) return;
    setExpandedTrip(expandedTrip === tripId ? null : tripId);
  };

  const handleStatusChange = async (tripId) => {
    try {
      await updateTripStatus(tripId, newStatus);
      setTrips((prev) =>
        prev.map((trip) => (trip.id === tripId ? { ...trip, status: newStatus } : trip))
      );
      setEditingStatus(null);
    } catch (error) {
      console.error("Greška pri ažuriranju statusa:", error);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm("Da li ste sigurni da želite obrisati ovaj putni nalog?")) {
      try {
        await deleteTrip(tripId);
        fetchData();
      } catch (error) {
        console.error("Greška pri brisanju putnog naloga:", error);
      }
    }
  };

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : "Nepoznato vozilo";
  };

  const handleSortChange = (e) => {
    const [key, direction] = e.target.value.split("-");
    setSortConfig({ key, direction });

    setTrips((prev) =>
      [...prev].sort((a, b) => {
        let valueA = a[key];
        let valueB = b[key];

        if (key === "start_time") {
          valueA = new Date(valueA);
          valueB = new Date(valueB);
        }

        if (valueA < valueB) return direction === "asc" ? -1 : 1;
        if (valueA > valueB) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Lista putnih naloga</h1>

      <div className="flex justify-between items-center mb-6">
        <Link to="/add-trip" className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition duration-300">
          + Dodaj novi putni nalog
        </Link>

        <select onChange={handleSortChange} className="border p-2 rounded-lg bg-white shadow-sm">
          <option value="driver_name-asc">Vozač (A-Z)</option>
          <option value="driver_name-desc">Vozač (Z-A)</option>
          <option value="status-asc">Status (A-Z)</option>
          <option value="status-desc">Status (Z-A)</option>
          <option value="start_time-desc">Datum (Najnoviji)</option>
          <option value="start_time-asc">Datum (Najstariji)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{trip.driver_name}</h2>
            <p className="text-gray-500">Status: {trip.status}</p>
            <p className="text-gray-500">Vozilo: {getVehicleName(trip.vehicle_id)}</p>

            <div className="mt-3 flex gap-2">
              <button 
                onClick={() => toggleDetails(trip.id)} 
                disabled={editingStatus} 
                className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded"
              >
                {expandedTrip === trip.id ? "Sakrij" : "Detalji"}
              </button>

              <button 
                onClick={() => setEditingStatus(editingStatus === trip.id ? null : trip.id)} 
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                {editingStatus === trip.id ? "Zatvori" : "Izmijeni status"}
              </button>

              <button 
                onClick={() => handleDeleteTrip(trip.id)}
                className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded"
              >
                Obriši
              </button>
            </div>

            {expandedTrip === trip.id && (
              <div className="mt-3 text-sm text-gray-700 border-t pt-3">
                <p><strong>Broj putnika:</strong> {trip.passengers}</p>
                <p><strong>Polazna lokacija:</strong> {trip.start_location}</p>
                <p><strong>Dolazna lokacija:</strong> {trip.end_location}</p>
                <p><strong>Početak:</strong> {formatDateTime(trip.start_time)}</p>
                <p><strong>Kraj:</strong> {formatDateTime(trip.end_time)}</p>
              </div>
            )}

            {editingStatus === trip.id && (
              <div className="mt-3">
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="border p-2 rounded w-full">
                  <option value="">Odaberi status</option>
                  <option value="evidentiran">Evidentiran</option>
                  <option value="potvrđen">Potvrđen</option>
                  <option value="odbijen">Odbijen</option>
                  <option value="završen">Završen</option>
                </select>

                <div className="flex justify-between mt-4">
                  <button onClick={() => handleStatusChange(trip.id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                    Sačuvaj
                  </button>
                  <button onClick={() => setEditingStatus(null)} className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded">
                    Otkaži
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripsList;