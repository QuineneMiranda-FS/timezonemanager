import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getLocation = () => api.get("/locations");
export const getLocationById = (id) => api.get(`/locations/${id}`);
export const createLocation = (location) => api.post("/locations", location);
export const updateLocationById = (id, data) =>
  api.put(`/locations/${id}`, data);
export const deleteLocationById = (id) => api.delete(`/locations/${id}`);
export const getLocations = () => api.get("/locations");
