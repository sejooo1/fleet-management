import React, { useEffect, useState } from "react";
import { getTrips } from "../services/api";
import { Link } from "react-router-dom";

const TripsList = () => {
  const [trips, setTrips] = useState([]);

  const fetchTrips = async () => {
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (error) {
      console.error("Greška pri dohvaćanju putnih naloga:", error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Lista putnih naloga</h1>
      
      {/* Dugme za dodavanje novog putnog naloga */}
      <div className="text-center mb-4">
        <Link to="/add-trip" className="bg-blue-500 text-white px-4 py-2 rounded">
          Dodaj novi putni nalog
        </Link>
      </div>

      <ul className="mt-4">
        {trips.map((trip) => (
          <li key={trip.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col mb-2">
            <p><strong>Vozač:</strong> {trip.driver_name}</p>
            <p><strong>Putnici:</strong> {trip.passengers}</p>
            <p><strong>Od:</strong> {trip.start_location}</p>
            <p><strong>Do:</strong> {trip.end_location}</p>
            <p><strong>Status:</strong> {trip.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripsList;