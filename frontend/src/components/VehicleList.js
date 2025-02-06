import React, { useEffect, useState } from "react";
import { getVehicles } from "../services/api";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const data = await getVehicles();
      setVehicles(data);
    };
    fetchVehicles();
  }, []);

  return (
    <div>
      <h1>Lista Vozila</h1>
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