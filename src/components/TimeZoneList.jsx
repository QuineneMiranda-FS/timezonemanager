import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTimeZone } from "../hooks/useTimeZone";
import AddTimeZoneForm from "./AddTimeZoneForm";

const TimeZoneList = () => {
  const {
    timeZones,
    loading,
    removeTimeZone,
    addTimeZone,
    updateTimeZone,
    locations,
  } = useTimeZone();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    cityName: "",
  });

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      name: record.name || "",
      fullName: record.fullName || "",
      cityName: record.locationData?.cityName || record.cityName || "",
    });
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => setHighlightedId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId]);

  const handleUpdate = async () => {
    const id = editingRecord?._id || editingRecord?.id;
    if (!id) return;

    try {
      const selectedLocation = locations.find(
        (loc) => loc.cityName.toLowerCase() === formData.cityName.toLowerCase(),
      );

      const submissionValues = {
        name: formData.name,
        fullName: formData.fullName,
        cityName: selectedLocation
          ? selectedLocation.cityName
          : formData.cityName,
        location: selectedLocation?._id || selectedLocation?.id || null,
        countryCode: "US",
      };

      await updateTimeZone(id, submissionValues);
      setHighlightedId(id);
      setIsEditModalOpen(false);
      setEditingRecord(null);
      Alert.alert("Success", "Time zone updated");
    } catch (err) {
      console.error("Update Failed:", err);
      Alert.alert("Error", "Update failed");
    }
  };

  const confirmDelete = (id) => {
    Alert.alert("Delete", "Delete this timezone?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => removeTimeZone(id), style: "destructive" },
    ]);
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={[
          styles.row,
          (item._id === highlightedId || item.id === highlightedId) &&
            styles.highlighted,
        ]}
      >
        <View style={{ flex: 2 }}>
          <Text style={styles.codeText}>{item._id || item.id}</Text>
          <Text style={styles.boldText}>
            {item.name} -{" "}
            {item.cityName || item.locationData?.cityName || "Unknown"}
          </Text>
          <Text style={styles.subText}>{item.fullName}</Text>
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
      <Text style={styles.title}>Time Zone Manager</Text>
      <AddTimeZoneForm onAdd={addTimeZone} locations={locations} />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <View style={styles.listContainer}>
        {timeZones.length > 0 ? (
          timeZones.map((item) => (
            <View key={item._id || item.id}>{renderItem({ item })}</View>
          ))
        ) : (
          <Text style={styles.emptyText}>No time zones found.</Text>
        )}
      </View>

      <Modal visible={isEditModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Time Zone</Text>

            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Abbr (EST)"
                value={formData.name}
                onChangeText={(val) =>
                  setFormData({ ...formData, name: val.toUpperCase() })
                }
                autoCapitalize="characters"
              />
              <TextInput
                style={[styles.input, { flex: 2 }]}
                placeholder="Full Name (IANA)"
                value={formData.fullName}
                onChangeText={(val) =>
                  setFormData({ ...formData, fullName: val })
                }
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="City Name (e.g. New York)"
              value={formData.cityName}
              onChangeText={(val) =>
                setFormData({ ...formData, cityName: val })
              }
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => setIsEditModalOpen(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.saveBtn]}
                onPress={handleUpdate}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Update Time Zone
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  listContainer: { marginTop: 10 },
  emptyText: { padding: 20, textAlign: "center", color: "#999" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  row: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  highlighted: { backgroundColor: "#fffbe6" },
  codeText: { fontSize: 10, color: "#888", fontFamily: "monospace" },
  boldText: { fontWeight: "bold", fontSize: 16 },
  subText: { color: "#666" },
  actions: { flexDirection: "row", gap: 10 },
  editBtn: { color: "#1890ff", marginRight: 10 },
  deleteBtn: { color: "#ff4d4f" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  inputGroup: { flexDirection: "row", gap: 10 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  btn: { padding: 10, borderRadius: 4 },
  saveBtn: { backgroundColor: "#1890ff" },
});

export default TimeZoneList;
