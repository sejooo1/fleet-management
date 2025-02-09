import axios from "axios";

// Postavi Railway backend URL
const API_URL = "https://fleet-management-production.up.railway.app/api";

// Funkcija za dobijanje tokena
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Uzima token iz localStorage
  return token ? { Authorization: `Bearer ${token}` } : {}; // Ako nema tokena, header ostaje prazan
};

// **Vozila API**
export const getVehicles = async () => {
  const response = await axios.get(`${API_URL}/vehicles`, { headers: getAuthHeaders() });
  return response.data;
};

export const addVehicle = async (vehicle) => {
  const response = await axios.post(`${API_URL}/vehicles`, vehicle, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteVehicle = async (id) => {
  await axios.delete(`${API_URL}/vehicles/${id}`, { headers: getAuthHeaders() });
};

export const updateVehicle = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/vehicles/${id}`, updatedData, { headers: getAuthHeaders() });
  return response.data;
};

// **Putni nalozi API**
export const getTrips = async () => {
  const response = await axios.get(`${API_URL}/trips`, { headers: getAuthHeaders() });
  return response.data;
};

export const addTrip = async (tripData) => {
  const response = await axios.post(`${API_URL}/trips`, tripData, { headers: getAuthHeaders() });
  return response.data;
};

export const deleteTrip = async (id) => {
  await axios.delete(`${API_URL}/trips/${id}`, { headers: getAuthHeaders() });
};

export const updateTripStatus = (tripId, status) => {
  return axios.put(
    `${API_URL}/trips/${tripId}/status`, 
    { status },
    { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }
  );
};

// **Izvještaji API (nema autentifikacije, svi mogu koristiti)**
export const getReport = async (vehicleId, startDate, endDate) => {
  const response = await axios.get(`${API_URL}/reports/usage`, {
    params: { vehicle_id: vehicleId, start_date: startDate, end_date: endDate },
  });
  return response.data;
};
