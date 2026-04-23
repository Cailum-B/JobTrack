import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { db } from "../db/database";
import { applications, categories } from "../db/schema";
import { eq } from "drizzle-orm";

export default function ApplicationsScreen({ navigation, route }) {
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const userId = route?.params?.userId || 1;

  async function loadApplications() {
    try {
      const result = await db.select().from(applications).where(eq(applications.userId, userId));
      setApps(result);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (route?.params?.refresh) {
      // reloading after add/edit so the list updates straight away
      loadApplications();
    }
  }, [route?.params?.refresh]);

  const filtered = apps.filter(a =>
    a.companyName.toLowerCase().includes(search.toLowerCase()) ||
    a.roleName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Applications</Text>
      <TextInput
        style={styles.search}
        placeholder="Search..."
        value={search}
        onChangeText={setSearch}
      />
      {filtered.length === 0 ? (
        <Text style={styles.empty}>No applications yet. Add one!</Text>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("AddApplication", { application: item, userId })}
            >
              <Text style={styles.company}>{item.companyName}</Text>
              <Text style={styles.role}>{item.roleName}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddApplication", { userId })}
      >
        <Text style={styles.addButtonText}>+ Add Application</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#2e7d32", marginBottom: 12 },
  search: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12 },
  card: { backgroundColor: "#f4faf6", padding: 14, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: "#2e7d32" },
  company: { fontSize: 16, fontWeight: "bold", color: "#1b1b1b" },
  role: { fontSize: 14, color: "#4a4a4a", marginTop: 2 },
  date: { fontSize: 12, color: "#888", marginTop: 4 },
  empty: { textAlign: "center", color: "#888", marginTop: 40 },
  addButton: { backgroundColor: "#2e7d32", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 12 },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
