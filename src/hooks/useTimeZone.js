import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import * as api from "../services/timezoneAPI";

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
        const normalizedId = String(tz._id || tz.id || "").trim();

        const cityName =
          tz.locationData?.cityName ||
          rawLocs.find((loc) => String(loc.timeZoneId) === normalizedId)
            ?.cityName ||
          "Unknown City";

        return { ...tz, id: normalizedId, cityName };
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
        cityName:
          newRecord.locationData?.cityName || values.cityName || "New City",
      };

      setTimeZones((prev) => [enrichedNewRecord, ...prev]);
      return newRecord;
    } catch (err) {
      Alert.alert("Error", "Could not add time zone");
    } finally {
      setLoading(false);
    }
  };

  const updateTimeZone = async (id, data) => {
    setLoading(true);
    try {
      const res = await api.updateTimeZoneById(id, data);
      const updatedRecord = res.data?.data;

      setTimeZones((prev) =>
        prev.map((tz) =>
          tz.id === id || tz._id === id
            ? {
                ...updatedRecord,
                id: updatedRecord._id || id,
                cityName:
                  updatedRecord.locationData?.cityName || "Unknown City",
              }
            : tz,
        ),
      );
    } catch (err) {
      Alert.alert("Update Failed", "Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const removeTimeZone = async (id) => {
    setLoading(true);
    try {
      await api.deleteTimeZoneById(id);
      setTimeZones((prev) =>
        prev.filter((tz) => String(tz._id) !== String(id)),
      );
    } catch (err) {
      Alert.alert("Delete Error", "Could not remove the entry.");
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
