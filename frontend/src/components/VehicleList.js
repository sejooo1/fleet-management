import React, { useEffect, useState } from "react";
import { getVehicles, deleteVehicle, updateVehicle } from "../services/api";
import AddVehicleForm from "./AddVehicleForm";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [editVehicle, setEditVehicle] = useState(null);
  const [editData, setEditData] = useState({
    brand: "",
    model: "",
    fuel_type: "",
  });

  const fetchVehicles = async () => {
    const data = await getVehicles();
    setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Da li ste sigurni da želite obrisati ovo vozilo?")) {
      await deleteVehicle(id);
      fetchVehicles();
    }
  };

  const handleEdit = (vehicle) => {
    setEditVehicle(vehicle.id);
    setEditData({
      brand: vehicle.brand,
      model: vehicle.model,
      fuel_type: vehicle.fuel_type,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await updateVehicle(editVehicle, editData);
    setEditVehicle(null);
    fetchVehicles();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Lista Vozila</h1>
      <AddVehicleForm onVehicleAdded={fetchVehicles} />
      <ul className="mt-4">
        {vehicles.map((vehicle) => (
          <li key={vehicle.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center mb-2">
            {editVehicle === vehicle.id ? (
              <form onSubmit={handleEditSubmit} className="flex space-x-2">
                <input type="text" name="brand" value={editData.brand} onChange={handleEditChange} required className="border p-2 rounded" />
                <input type="text" name="model" value={editData.model} onChange={handleEditChange} required className="border p-2 rounded" />
                <select name="fuel_type" value={editData.fuel_type} onChange={handleEditChange} className="border p-2 rounded">
                  <option value="benzin">Benzin</option>
                  <option value="dizel">Dizel</option>
                  <option value="plin">Plin</option>
                </select>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Sačuvaj</button>
                <button onClick={() => setEditVehicle(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Otkaži</button>
              </form>
            ) : (
              <>
                <span className="font-semibold">{vehicle.brand} {vehicle.model} - {vehicle.fuel_type}</span>
                <div>
                  <button onClick={() => handleEdit(vehicle)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Uredi</button>
                  <button onClick={() => handleDelete(vehicle.id)} className="bg-red-500 text-white px-4 py-2 rounded">Obriši</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VehicleList;