import React from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import TimeZoneList from "./components/TimeZoneList";
import LocationList from "./components/LocationList";

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.h1}>Global TimeZone Manager</Text>
          <Text style={styles.p}>
            View, Add, Edit or Delete Timezones below.
          </Text>
        </View>

        <View style={styles.main}>
          <TimeZoneList />
          <LocationList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20 },
  header: { marginBottom: 20 },
  h1: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  p: { fontSize: 16, color: "#666" },
  main: { gap: 20 },
});
