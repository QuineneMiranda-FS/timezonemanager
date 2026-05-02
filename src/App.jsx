import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginScreen from "./login";
import SignupScreen from "./signup";
import TimeZoneList from "./components/TimeZoneList";
import LocationList from "./components/LocationList";

function NavigationWrapper() {
  const { user, isLoading, logout } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return showSignup ? (
      <SignupScreen onSwitch={() => setShowSignup(false)} />
    ) : (
      <LoginScreen onSwitch={() => setShowSignup(true)} />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { flex: 1 }]}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.h1}>Global TimeZone Manager</Text>
            <Button title="Logout" onPress={logout} color="#ff4444" />
          </View>
          <Text style={styles.p}>
            View, Add, Edit or Delete Timezones below.
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <TimeZoneList />

          {/* Visual Divider */}
          <View
            style={{ height: 1, backgroundColor: "#eee", marginVertical: 30 }}
          />

          <LocationList />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationWrapper />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20 },
  header: { marginBottom: 20 },
  h1: { fontSize: 24, fontWeight: "bold" },
  p: { fontSize: 16, color: "#666" },
  main: { gap: 20 },
});
