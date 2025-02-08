import axios from "axios";

// Postavi Railway backend URL
const API_URL = "https://fleet-management-production.up.railway.app/api";

// Vozila API
export const getVehicles = async () => {
  const response = await axios.get(`${API_URL}/vehicles`);
  return response.data;
};

export const addVehicle = async (vehicle) => {
  const response = await axios.post(`${API_URL}/vehicles`, vehicle);
  return response.data;
};

export const deleteVehicle = async (id) => {
  await axios.delete(`${API_URL}/vehicles/${id}`);
};

export const updateVehicle = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/vehicles/${id}`, updatedData);
  return response.data;
};

// Putni nalozi API
export const getTrips = async () => {
  const response = await axios.get(`${API_URL}/trips`);
  return response.data;
};

export const addTrip = async (tripData) => {
  const response = await axios.post(`${API_URL}/trips`, tripData);
  return response.data;
};

export const deleteTrip = async (id) => {
  await axios.delete(`${API_URL}/trips/${id}`);
};

export const updateTripStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/trips/${id}/status`, { status });
  return response.data;
};
