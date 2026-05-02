import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocation } from "../hooks/useLocation";

const LocationScreen = () => {
  const { locations, loading, refresh, removeLocation } = useLocation();

  const handleDelete = (id, cityName) => {
    Alert.alert(
      "Delete Location",
      `Are you sure you want to remove ${cityName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeLocation(id),
        },
      ],
    );
  };

  const renderLocationItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.cityName}>{item.cityName}</Text>
        <Text style={styles.countryCode}>{item.countryCode}</Text>
        <Text style={styles.tzLabel}>
          {item.tzName} • {item.tzFullName}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => handleDelete(item._id || item.id, item.cityName)}
        style={styles.deleteBtn}
      >
        <Text style={styles.deleteText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Managed Locations</Text>
      </View>

      <FlatList
        data={locations}
        keyExtractor={(item) => item._id || item.id}
        renderItem={renderLocationItem}
        onRefresh={refresh}
        refreshing={loading}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && <Text style={styles.empty}>No locations found.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#333" },
  listContent: { padding: 15 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // **Elevation for Android / Shadow for iOS
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  info: { flex: 1 },
  cityName: { fontSize: 18, fontWeight: "700", color: "#1a1a1a" },
  countryCode: { fontSize: 14, color: "#666", textTransform: "uppercase" },
  tzLabel: { fontSize: 12, color: "#007bff", marginTop: 4, fontWeight: "500" },
  deleteBtn: { padding: 8 },
  deleteText: { color: "#ff3b30", fontSize: 14, fontWeight: "600" },
  empty: { textAlign: "center", marginTop: 40, color: "#999" },
});

export default LocationScreen;
