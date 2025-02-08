import React, { useState, useEffect } from "react";
import { getVehicles, getReport } from "../services/api";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Funkcija za formatiranje datuma
const formatDateTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("hr-HR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Funkcija za zamjenu afrikata
const replaceDiacritics = (text) => {
  if (!text) return "";
  return text
    .replace(/č/g, "c").replace(/Č/g, "C")
    .replace(/ć/g, "c").replace(/Ć/g, "C")
    .replace(/đ/g, "dj").replace(/Đ/g, "Dj")
    .replace(/ž/g, "z").replace(/Ž/g, "Z")
    .replace(/š/g, "s").replace(/Š/g, "S");
};

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

  const handleDownloadPDF = () => {
    if (!reportData || reportData.length === 0) {
      alert("Nema podataka za generisanje PDF-a.");
      return;
    }

    const doc = new jsPDF();

    // Naslov (konvertovan bez afrikata)
    doc.text(replaceDiacritics("Izvještaj o korištenju vozila"), 14, 10);
    doc.text(replaceDiacritics(`Vremenski period: ${startDate} - ${endDate}`), 14, 18);

    const tableColumn = ["Pocetak", "Kraj", "Vozac", "Status"];
    const tableRows = [];

    reportData.forEach((trip) => {
      tableRows.push([
        formatDateTime(trip.start_time),
        formatDateTime(trip.end_time),
        replaceDiacritics(trip.driver_name),
        replaceDiacritics(trip.status),
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [46, 204, 113] },
    });

    doc.save(`Izvjestaj_${startDate}_do_${endDate}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Izvještaj o korištenju vozila
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-600 font-semibold">Vozilo</label>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-600 font-semibold">Početni datum</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="text-gray-600 font-semibold">Krajnji datum</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        {error && <p className="text-red-500 font-semibold">{error}</p>}

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-semibold shadow-md transition duration-300 w-full"
          >
            Generiši izvještaj
          </button>
        </div>
      </form>

      {loading && <p className="text-blue-500 text-center mt-4 font-semibold">Učitavanje izvještaja...</p>}

      {reportData && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-gray-700">Rezultati izvještaja</h2>
          {reportData.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300 mt-4 rounded-lg overflow-hidden shadow-md">
              <thead>
                <tr className="bg-green-500 text-white text-left">
                  <th className="border p-3">Početak</th>
                  <th className="border p-3">Kraj</th>
                  <th className="border p-3">Vozač</th>
                  <th className="border p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-100 transition">
                    <td className="border p-3">{formatDateTime(trip.start_time)}</td>
                    <td className="border p-3">{formatDateTime(trip.end_time)}</td>
                    <td className="border p-3">{trip.driver_name}</td>
                    <td className="border p-3 font-semibold text-green-600">{trip.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 mt-4">Nema podataka za odabrani period.</p>
          )}

          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-md font-semibold shadow-md transition duration-300"
            >
              Preuzmi PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsForm;