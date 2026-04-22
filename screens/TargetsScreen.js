import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { db } from "../db/database";
import { targets, applications } from "../db/schema";
import { eq } from "drizzle-orm";

export default function TargetsScreen({ route }) {
  const userId = route?.params?.userId || 1;
  const [targetList, setTargetList] = useState([]);
  const [appCount, setAppCount] = useState(0);
  const [type, setType] = useState("weekly");
  const [goal, setGoal] = useState("");

  async function loadData() {
    const t = await db.select().from(targets).where(eq(targets.userId, userId));
    setTargetList(t);
    const a = await db.select().from(applications).where(eq(applications.userId, userId));
    setAppCount(a.length);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleAdd() {
    if (!goal || isNaN(goal)) {
      Alert.alert("Please enter a valid goal number");
      return;
    }
    await db.insert(targets).values({
      type,
      goal: parseInt(goal),
      categoryId: null,
      userId,
    });
    setGoal("");
    loadData();
  }

  async function handleDelete(id) {
    await db.delete(targets).where(eq(targets.id, id));
    loadData();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Targets</Text>
      <Text style={styles.count}>Total applications: {appCount}</Text>
      <Text style={styles.label}>Type</Text>
      <View style={styles.row}>
        {["weekly", "monthly"].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.typeButton, type === t && styles.typeSelected]}
            onPress={() => setType(t)}
          >
            <Text style={type === t ? styles.typeTextSelected : styles.typeText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.label}>Goal (number of applications)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 5"
        value={goal}
        onChangeText={setGoal}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Target</Text>
      </TouchableOpacity>
      <FlatList
        data={targetList}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => {
          const progress = Math.min(appCount / item.goal, 1);
          const met = appCount >= item.goal;
          return (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.type} target: {item.goal} applications</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: met ? "#2e7d32" : "#4caf7f" }]} />
              </View>
              <Text style={styles.progressText}>
                {appCount}/{item.goal} — {met ? "✅ Target met!" : `${item.goal - appCount} remaining`}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteBtn}>Remove</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#2e7d32", marginBottom: 8 },
  count: { fontSize: 16, color: "#444", marginBottom: 16 },
  label: { fontSize: 14, color: "#444", marginBottom: 6 },
  row: { flexDirection: "row", marginBottom: 10 },
  typeButton: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginRight: 8 },
  typeSelected: { backgroundColor: "#2e7d32", borderColor: "#2e7d32" },
  typeText: { color: "#444" },
  typeTextSelected: { color: "#fff" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#2e7d32", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  card: { backgroundColor: "#f4faf6", padding: 14, borderRadius: 8, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#1b1b1b", marginBottom: 8 },
  progressBar: { height: 10, backgroundColor: "#ddd", borderRadius: 5, marginBottom: 6 },
  progressFill: { height: 10, borderRadius: 5 },
  progressText: { fontSize: 13, color: "#444", marginBottom: 6 },
  deleteBtn: { color: "#c0392b", fontWeight: "bold" },
});