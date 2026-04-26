import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import * as api from "../API/timezoneAPI";

export const useTimeZone = () => {
  const [timeZones, setTimeZones] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTimeZones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tzRes, locRes] = await Promise.all([
        api.getTimeZone(),
        api.getLocations(),
      ]);

      const rawTZ = tzRes.data?.data || [];
      const rawLocs = locRes.data?.data || [];

      const enriched = rawTZ.map((tz) => {
        const currentTzId = String(tz.id || tz._id || "").trim();
        const cityMatch = rawLocs.find((loc) => {
          const locTzId = String(loc.timeZoneId || loc.tzId || "").trim();
          return locTzId === currentTzId;
        });

        return {
          ...tz,
          id: currentTzId,
          cityName: cityMatch ? cityMatch.cityName : "Unknown City",
        };
      });

      setTimeZones(enriched);
      setLocations(rawLocs);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to load time zones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimeZones();
  }, [fetchTimeZones]);

  const addTimeZone = async (values) => {
    setLoading(true);
    try {
      const res = await api.createTimeZone(values);
      const newRecord = res.data?.data || res.data;

      const enrichedNewRecord = {
        ...newRecord,
        id: newRecord._id || newRecord.id,
        cityName: values.cityName || "New City",
      };

      setTimeZones((prev) => [enrichedNewRecord, ...prev]);
      return newRecord;
    } catch (err) {
      Alert.alert("Error", "Could not add time zone");
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateTimeZone = async (id, data) => {
    setLoading(true);
    try {
      const { _id, __v, ...updateData } = data;
      const cityName = Array.isArray(data.location)
        ? data.location[0]
        : data.location;
      const payload = { ...updateData, cityName };

      const res = await api.updateTimeZoneById(id, payload);
      const updatedRecord = res.data?.data || res.data;

      const cityMatch = locations.find(
        (loc) => String(loc.timeZoneId) === String(id),
      );

      const enrichedUpdate = {
        ...updatedRecord,
        id: updatedRecord._id || id,
        cityName: cityMatch ? cityMatch.cityName : cityName || "Unknown City",
      };

      setTimeZones((prev) => {
        return prev.map((tz) => (tz.id === id ? enrichedUpdate : tz));
      });
    } catch (err) {
      Alert.alert("Update Failed", "Check your connection and try again.");
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const removeTimeZone = async (id) => {
    setLoading(true);
    try {
      await api.deleteTimeZoneById(id);
      setTimeZones((prev) => prev.filter((tz) => tz.id !== id));
    } catch (err) {
      Alert.alert("Delete Error", "Could not remove the entry.");
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    timeZones,
    locations,
    loading,
    error,
    fetchTimeZones,
    addTimeZone,
    updateTimeZone,
    removeTimeZone,
  };
};
