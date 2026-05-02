import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocation } from "../hooks/useLocation";
import { useTimeZone } from "../hooks/useTimeZone";

const LocationList = () => {
  const {
    locations,
    loading,
    addLocation,
    updateLocation,
    removeLocation,
    refresh,
  } = useLocation();
  const { timeZones, loading: tzLoading } = useTimeZone();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    cityName: "",
    countryCode: "",
    timeZoneId: "",
  });

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      cityName: record.cityName || "",
      countryCode: record.countryCode || "",
      timeZoneId: record.timeZoneId || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.cityName || !formData.countryCode) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      if (editingRecord) {
        await updateLocation(editingRecord._id || editingRecord.id, formData);
      } else {
        await addLocation(formData);
      }
      if (refresh) await refresh();
      setIsModalOpen(false);
      setFormData({ cityName: "", countryCode: "", timeZoneId: "" });
    } catch (error) {
      console.error("Save Failed:", error);
    }
  };

  const confirmDelete = (id) => {
    Alert.alert("Delete", "Delete this location?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => removeLocation(id),
      },
    ]);
  };

  const renderLocationRow = (item) => {
    const tzMatch = timeZones.find(
      (tz) => (tz.id || tz._id)?.toString() === item.timeZoneId?.toString(),
    );

    return (
      <View style={styles.row} key={item._id || item.id}>
        <View style={{ flex: 2 }}>
          <Text style={styles.cityText}>
            {item.cityName}, {item.countryCode}
          </Text>
          <Text style={styles.tzText}>{tzMatch ? tzMatch.name : "N/A"}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => confirmDelete(item._id || item.id)}>
            <Text style={styles.deleteBtn}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Location Manager</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setEditingRecord(null);
            setFormData({ cityName: "", countryCode: "", timeZoneId: "" });
            setIsModalOpen(true);
          }}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {loading || tzLoading ? (
        <ActivityIndicator size="large" color="#1890ff" />
      ) : (
        <View>{locations.map((item) => renderLocationRow(item))}</View>
      )}

      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingRecord ? "Edit" : "Add"} Location
            </Text>
            <TextInput
              style={styles.input}
              placeholder="City Name"
              value={formData.cityName}
              onChangeText={(text) =>
                setFormData({ ...formData, cityName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Country Code (e.g. US)"
              value={formData.countryCode}
              onChangeText={(text) =>
                setFormData({ ...formData, countryCode: text })
              }
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Text style={styles.cancelBtn}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  addBtn: {
    backgroundColor: "#1890ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addBtnText: { color: "#fff", fontWeight: "bold" },
  row: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  cityText: { fontSize: 16, fontWeight: "600" },
  tzText: { fontSize: 12, color: "#666" },
  actions: { flexDirection: "row", gap: 15 },
  editBtn: { color: "#1890ff" },
  deleteBtn: { color: "#ff4d4f" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: { marginTop: 10 },
  saveBtn: {
    backgroundColor: "#1890ff",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold" },
  cancelBtn: { textAlign: "center", color: "#666" },
});

export default LocationList;
