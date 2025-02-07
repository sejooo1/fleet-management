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
    <div>
      <h1>Lista Vozila</h1>
      <AddVehicleForm onVehicleAdded={fetchVehicles} />
      <ul>
        {vehicles.map((vehicle) => (
          <li key={vehicle.id}>
            {editVehicle === vehicle.id ? (
              <form onSubmit={handleEditSubmit}>
                <input type="text" name="brand" value={editData.brand} onChange={handleEditChange} required />
                <input type="text" name="model" value={editData.model} onChange={handleEditChange} required />
                <select name="fuel_type" value={editData.fuel_type} onChange={handleEditChange}>
                  <option value="benzin">Benzin</option>
                  <option value="dizel">Dizel</option>
                  <option value="plin">Plin</option>
                </select>
                <button type="submit">Sačuvaj</button>
                <button onClick={() => setEditVehicle(null)} style={{ marginLeft: "10px" }}>
                  Otkaži
                </button>
              </form>
            ) : (
              <>
                {vehicle.brand} {vehicle.model} - {vehicle.fuel_type}
                <button onClick={() => handleEdit(vehicle)} style={{ marginLeft: "10px", color: "blue" }}>
                  Uredi
                </button>
                <button onClick={() => handleDelete(vehicle.id)} style={{ marginLeft: "10px", color: "red" }}>
                  Obriši
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VehicleList;