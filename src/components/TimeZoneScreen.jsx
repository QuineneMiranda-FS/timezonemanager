import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useTimeZone } from "../hooks/useTimeZone";

const TimeZoneScreen = () => {
  const { timeZones, loading, fetchTimeZones, removeTimeZone } = useTimeZone();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.cityName}>{item.cityName}</Text>
        <Text style={styles.tzDetail}>{item.name || "GMT+0"}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => removeTimeZone(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>My Time Zones</Text>

      {loading && timeZones.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={timeZones}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onRefresh={fetchTimeZones}
          refreshing={loading}
          ListEmptyComponent={
            <Text style={styles.empty}>No time zones added yet.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { fontSize: 24, fontWeight: "bold", padding: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  cityName: { fontSize: 18, fontWeight: "600" },
  tzDetail: { color: "#666", marginTop: 4 },
  actions: { flexDirection: "row" },
  deleteButton: { padding: 8 },
  deleteText: { color: "#ff3b30", fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: 50, color: "#999" },
});

export default TimeZoneScreen;
