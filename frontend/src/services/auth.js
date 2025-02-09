import axios from "axios";

const API_URL = "https://fleet-management-production.up.railway.app/api";

export const login = async (username, password) => {
  try {

      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      

      if (response.status === 200) {
          const data = response.data;

          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify({ username, role: data.role }));
          return { username, role: data.role };
      }
  } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : error.message);
      return null;
  }
};


export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};