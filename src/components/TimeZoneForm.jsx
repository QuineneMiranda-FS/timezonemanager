import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTimeZone } from "../hooks/useTimeZone";

function TimeZoneList() {
  const {
    timeZones,
    loading,
    error,
    removeTimeZone,
    addTimeZone,
    updateTimeZone,
  } = useTimeZone();
  const [editingId, setEditingId] = useState(null);

  if (loading && timeZones.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Zone Manager</Text>

      <AddTimeZoneForm onAdd={addTimeZone} locations={[]} />

      {error && <Text style={styles.errorText}>Error: {error.message}</Text>}

      <FlatList
        data={timeZones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          if (editingId === item.id) {
            return (
              <EditTimeZoneForm
                item={item}
                onUpdate={updateTimeZone}
                onCancel={() => setEditingId(null)}
              />
            );
          }

          return (
            <View style={styles.listItem}>
              <View>
                <Text style={styles.tzName}>{item.name}</Text>
                <Text style={styles.tzSubText}>{item.cityName}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setEditingId(item.id)}
                >
                  <Text style={styles.buttonTextSmall}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeTimeZone(item.id)}
                >
                  <Text style={styles.buttonTextSmall}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tzName: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    padding: 8,
    borderRadius: 5,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginVertical: 10,
  },
});

export default TimeZoneList;
