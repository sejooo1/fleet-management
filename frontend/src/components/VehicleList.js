import React, { useEffect, useState } from "react";
import { getVehicles } from "../services/api";
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

  return (
    <div>
      <h1>Lista Vozila</h1>
      <AddVehicleForm onVehicleAdded={fetchVehicles} />
      <ul>
        {vehicles.map((vehicle) => (
          <li key={vehicle.id}>
            {vehicle.brand} {vehicle.model} - {vehicle.fuel_type}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VehicleList;
