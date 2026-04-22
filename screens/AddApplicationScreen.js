import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { db } from "../db/database";
import { applications, categories, statusLogs } from "../db/schema";
import { eq } from "drizzle-orm";

export default function AddApplicationScreen({ navigation, route }) {
  const existing = route?.params?.application;
  const userId = route?.params?.userId || 1;

  const [companyName, setCompanyName] = useState(existing?.companyName || "");
  const [roleName, setRoleName] = useState(existing?.roleName || "");
  const [date, setDate] = useState(existing?.date || "");
  const [notes, setNotes] = useState(existing?.notes || "");
  const [categoryId, setCategoryId] = useState(existing?.categoryId || null);
  const [status, setStatus] = useState("Applied");
  const [cats, setCats] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      const result = await db.select().from(categories).where(eq(categories.userId, userId));
      setCats(result);
      if (!existing && result.length > 0) setCategoryId(result[0].id);
    }
    loadCategories();
  }, []);

  async function handleSave() {
    if (!companyName || !roleName || !date) {
      Alert.alert("Please fill in company, role and date");
      return;
    }
    try {
      if (existing) {
        await db.update(applications)
          .set({ companyName, roleName, date, notes, categoryId })
          .where(eq(applications.id, existing.id));
      } else {
        const result = await db.insert(applications).values({
          companyName, roleName, date, metric: 1, categoryId, notes, userId
        }).returning();
        await db.insert(statusLogs).values({
          applicationId: result[0].id,
          status,
          changedAt: date,
        });
      }
      navigation.navigate("Applications", { refresh: Date.now(), userId });
    } catch (e) {
      console.error(e);
      Alert.alert("Something went wrong");
    }
  }

  async function handleDelete() {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete", onPress: async () => {
          await db.delete(applications).where(eq(applications.id, existing.id));
          navigation.navigate("Applications", { refresh: Date.now(), userId });
        }
      }
    ]);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{existing ? "Edit Application" : "New Application"}</Text>
      <Text style={styles.label}>Company</Text>
      <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} placeholder="Company name" />
      <Text style={styles.label}>Role</Text>
      <TextInput style={styles.input} value={roleName} onChangeText={setRoleName} placeholder="Role name" />
      <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2026-01-01" />
      <Text style={styles.label}>Notes</Text>
      <TextInput style={styles.input} value={notes} onChangeText={setNotes} placeholder="Optional notes" />
      <Text style={styles.label}>Category</Text>
      {cats.map(cat => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.catButton, categoryId === cat.id && styles.catSelected]}
          onPress={() => setCategoryId(cat.id)}
        >
          <Text>{cat.icon} {cat.name}</Text>
        </TouchableOpacity>
      ))}
      {!existing && (
        <>
          <Text style={styles.label}>Initial Status</Text>
          {["Applied", "Interviewing", "Offer", "Rejected"].map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.catButton, status === s && styles.catSelected]}
              onPress={() => setStatus(s)}
            >
              <Text>{s}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      {existing && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#2e7d32", marginBottom: 16 },
  label: { fontSize: 14, color: "#444", marginBottom: 4, marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, fontSize: 16 },
  catButton: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 6 },
  catSelected: { backgroundColor: "#e8f3ec", borderColor: "#2e7d32" },
  button: { backgroundColor: "#2e7d32", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 20 },
  deleteButton: { backgroundColor: "#c0392b", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 10, marginBottom: 40 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});