import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  // This ensures it uses your Render URL from config.js
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTimeZone = () => api.get("/timezones");
export const getTimeZoneById = (id) => api.get(`/timezones/${id}`);
export const createTimeZone = (timeZone) => api.post("/timezones", timeZone);
export const updateTimeZoneById = (id, data) =>
  api.put(`/timezones/${id}`, data);
export const deleteTimeZoneById = (id) => api.delete(`/timezones/${id}`);
export const getLocations = () => api.get("/locations");
