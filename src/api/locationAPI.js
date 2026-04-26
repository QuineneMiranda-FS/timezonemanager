import axios from "axios";
// Import your Render URL
import { API_BASE_URL } from "../config";

const api = axios.create({
  // Swap localhost for your Render URL
  baseURL: API_BASE_URL,
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
