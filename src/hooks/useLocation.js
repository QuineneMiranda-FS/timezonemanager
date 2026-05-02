import { useState, useEffect, useCallback } from "react";
import * as locApi from "../services/locationAPI";
import * as tzApi from "../services/timezoneAPI";

export const useLocation = () => {
  const [locations, setLocations] = useState([]);
  const [timeZones, setTimeZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [locRes, tzRes] = await Promise.all([
        locApi.getLocations(),
        tzApi.getTimeZone(),
      ]);

      const rawLocs = locRes.data?.data || [];
      const rawTzs = tzRes.data?.data || [];

      const enrichedLocs = rawLocs.map((loc) => {
        const tzMatch = rawTzs.find(
          (tz) => (tz.id || tz._id) === loc.timeZoneId,
        );
        return {
          ...loc,
          tzName: tzMatch ? tzMatch.name : "N/A",
          tzFullName: tzMatch ? tzMatch.fullName : "Unknown",
        };
      });

      setLocations(enrichedLocs);
      setTimeZones(rawTzs);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const addLocation = async (locationData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await locApi.createLocation({
        ...locationData,
        fullCityName: `${locationData.cityName}, ${locationData.countryCode}`,
      });

      const newRecord = res.data?.data || res.data;
      const tzMatch = timeZones.find(
        (tz) => (tz.id || tz._id) === newRecord.timeZoneId,
      );

      const enrichedRecord = {
        ...newRecord,
        tzName: tzMatch ? tzMatch.name : "N/A",
        tzFullName: tzMatch ? tzMatch.fullName : "Unknown",
      };

      setLocations((prev) => [enrichedRecord, ...prev]);
      return enrichedRecord;
    } catch (err) {
      const serverMessage = err.response?.data?.message || err.message;
      setError(serverMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async (id, data) => {
    setLoading(true);
    try {
      const {
        _id,
        id: redundant,
        __v,
        createdAt,
        updatedAt,
        ...payload
      } = data;

      const res = await locApi.updateLocationById(id, payload);
      const updatedRecord = res.data?.data || res.data;

      setLocations((prev) =>
        prev.map((loc) =>
          (loc._id || loc.id) === id ? { ...loc, ...updatedRecord } : loc,
        ),
      );
      return updatedRecord;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const removeLocation = async (id) => {
    try {
      await locApi.deleteLocationById(id);

      setLocations((prev) =>
        prev.filter((loc) => String(loc._id) !== String(id)),
      );
    } catch (err) {
      Alert.alert("Error", "Delete failed.");
    } finally {
      setLoading(false);
    }
  };

  return {
    locations,
    timeZones,
    loading,
    error,
    addLocation,
    updateLocation,
    removeLocation,
    refresh: fetchAllData,
  };
};
