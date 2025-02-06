import axios from "axios";

// Postavi Railway backend URL
const API_URL = "https://fleet-management-production.up.railway.app/api";

// Dohvati sva vozila
export const getVehicles = async () => {
  const response = await axios.get(`${API_URL}/vehicles`);
  return response.data;
};

// Dodaj novo vozilo
export const addVehicle = async (vehicle) => {
  const response = await axios.post(`${API_URL}/vehicles`, vehicle);
  return response.data;
};

//Obriši vozilo
export const deleteVehicle = async (id) => {
    await axios.delete(`${API_URL}/vehicles/${id}`);
  };
  