import React, { useEffect, useState } from "react";
import { getVehicles, deleteVehicle, updateVehicle } from "../services/api";
import { Link } from "react-router-dom";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [expandedVehicle, setExpandedVehicle] = useState(null);
  const [editVehicle, setEditVehicle] = useState(null);
  const [editData, setEditData] = useState({
    brand: "",
    model: "",
    chassis_number: "",
    engine_number: "",
    power_kw: "",
    power_hp: "",
    fuel_type: "",
    production_year: "",
  });

  const [sortConfig, setSortConfig] = useState({ key: "brand", direction: "asc" });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const data = await getVehicles();
    setVehicles(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Da li ste sigurni da želite obrisati ovo vozilo?")) {
      await deleteVehicle(id);
      fetchVehicles();
    }
  };

  const toggleDetails = (vehicle) => {
    if (editVehicle) return;
    setExpandedVehicle(expandedVehicle === vehicle.id ? null : vehicle.id);
  };

  const handleEdit = (vehicle) => {
    if (expandedVehicle) setExpandedVehicle(null);
    setEditVehicle(editVehicle === vehicle.id ? null : vehicle.id);
    setEditData({ ...vehicle });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateVehicle(editVehicle, editData);
    setVehicles((prev) =>
      prev.map((v) => (v.id === editVehicle ? { ...v, ...editData } : v))
    );
    setEditVehicle(null);
  };

  const handleSortChange = (e) => {
    const [key, direction] = e.target.value.split("-");
    setSortConfig({ key, direction });

    setVehicles((prev) =>
      [...prev].sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Lista vozila</h1>

      {/* Kontrole za dodavanje i sortiranje */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/add-vehicle"
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition duration-300"
        >
          + Dodaj novo vozilo
        </Link>

        {/* Dropdown za sortiranje */}
        <select
          onChange={handleSortChange}
          className="border p-2 rounded-lg bg-white shadow-sm"
        >
          <option value="brand-asc">Marka (A-Z)</option>
          <option value="brand-desc">Marka (Z-A)</option>
          <option value="model-asc">Model (A-Z)</option>
          <option value="model-desc">Model (Z-A)</option>
          <option value="production_year-desc">Godina (Najnoviji)</option>
          <option value="production_year-asc">Godina (Najstariji)</option>
        </select>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{vehicle.brand} {vehicle.model}</h2>
            <p className="text-gray-500">{vehicle.fuel_type}</p>

            <div className="mt-3 flex gap-2">
              <button onClick={() => toggleDetails(vehicle)} disabled={editVehicle} className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded">
                {expandedVehicle === vehicle.id ? "Sakrij" : "Detalji"}
              </button>
              <button onClick={() => handleEdit(vehicle)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                {editVehicle === vehicle.id ? "Zatvori" : "Uredi"}
              </button>
              <button onClick={() => handleDelete(vehicle.id)} className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded">
                Obriši
              </button>
            </div>

            {/* Detalji o vozilu */}
            {expandedVehicle === vehicle.id && (
              <div className="mt-3 text-sm text-gray-700 border-t pt-3">
                <p><strong>Broj šasije:</strong> {vehicle.chassis_number}</p>
                <p><strong>Broj motora:</strong> {vehicle.engine_number}</p>
                <p><strong>Snaga:</strong> {vehicle.power_kw} kW / {vehicle.power_hp} HP</p>
                <p><strong>Godina proizvodnje:</strong> {vehicle.production_year}</p>
              </div>
            )}

            {/* Forma za uređivanje unutar kartice */}
            {editVehicle === vehicle.id && (
              <form onSubmit={handleEditSubmit} className="mt-3 space-y-2 border-t pt-3">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Marka", name: "brand" },
                    { label: "Model", name: "model" },
                    { label: "Broj šasije", name: "chassis_number" },
                    { label: "Broj motora", name: "engine_number" },
                    { label: "Snaga (kW)", name: "power_kw" },
                    { label: "Snaga (HP)", name: "power_hp" },
                    { label: "Godina proizvodnje", name: "production_year" }
                  ].map(({ label, name }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium">{label}</label>
                      <input type="text" name={name} value={editData[name]} onChange={handleEditChange} required className="border p-2 rounded w-full" />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium">Vrsta goriva</label>
                    <select name="fuel_type" value={editData.fuel_type} onChange={handleEditChange} className="border p-2 rounded w-full">
                      <option value="benzin">Benzin</option>
                      <option value="dizel">Dizel</option>
                      <option value="plin">Plin</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between mt-4">
                  <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Sačuvaj</button>
                  <button type="button" onClick={() => setEditVehicle(null)} className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded">Otkaži</button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleList;