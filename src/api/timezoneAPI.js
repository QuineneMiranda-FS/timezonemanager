import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api",
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
