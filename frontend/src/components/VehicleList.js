import React, { useEffect, useState } from "react";
import { getVehicles, deleteVehicle } from "../services/api";
import AddVehicleForm from "./AddVehicleForm";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);

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

  return (
    <div>
      <h1>Lista Vozila</h1>
      <AddVehicleForm onVehicleAdded={fetchVehicles} />
      <ul>
        {vehicles.map((vehicle) => (
          <li key={vehicle.id}>
            {vehicle.brand} {vehicle.model} - {vehicle.fuel_type}
            <button onClick={() => handleDelete(vehicle.id)} style={{ marginLeft: "10px", color: "red" }}>
              Obriši
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VehicleList;