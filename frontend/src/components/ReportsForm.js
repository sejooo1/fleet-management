import React, { useState, useEffect } from "react";
import { getVehicles, getReport } from "../services/api";

const ReportsForm = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicle || !startDate || !endDate) {
      setError("Molimo unesite sve podatke.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await getReport(selectedVehicle, startDate, endDate);
      setReportData(data);
    } catch (error) {
      console.error("Greška pri dohvaćanju izvještaja:", error);
      setError("Greška pri dohvaćanju izvještaja.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Izvještaj o korištenju vozila</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-600">Vozilo</label>
          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
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

        <div>
          <label className="text-gray-600">Početni datum</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="text-gray-600">Krajnji datum</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded w-full text-lg">
          Generiši izvještaj
        </button>
      </form>

      {/* Prikaz rezultata izvještaja */}
      {loading && <p className="text-blue-500 text-center mt-4">Učitavanje izvještaja...</p>}

      {reportData && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold">Rezultati izvještaja</h2>
          {reportData.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Početak</th>
                  <th className="border p-2">Kraj</th>
                  <th className="border p-2">Vozač</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((trip) => (
                  <tr key={trip.id}>
                    <td className="border p-2">{trip.start_time}</td>
                    <td className="border p-2">{trip.end_time}</td>
                    <td className="border p-2">{trip.driver_name}</td>
                    <td className="border p-2">{trip.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 mt-4">Nema podataka za odabrani period.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsForm;