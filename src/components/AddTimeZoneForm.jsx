import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

const AddTimeZoneForm = ({ onAdd, locations }) => {
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [cityName, setCityName] = useState("");

  const handleAdd = async () => {
    if (!name || !fullName) return;

    const selectedLocation = locations.find(
      (loc) => loc.cityName.toLowerCase() === cityName.toLowerCase(),
    );

    const submissionValues = {
      name,
      fullName,
      cityName: selectedLocation ? selectedLocation.cityName : cityName,
      countryCode: "US",
    };

    await onAdd(submissionValues);

    setName("");
    setFullName("");
    setCityName("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Abbr (EST)"
          value={name}
          onChangeText={setName}
          autoCapitalize="characters"
        />
        <TextInput
          style={[styles.input, { flex: 2 }]}
          placeholder="Full Name (IANA)"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="City Name (e.g. New York)"
        value={cityName}
        onChangeText={setCityName}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Time Zone</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  inputGroup: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d9d9d9",
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#1890ff",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddTimeZoneForm;
