import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { db } from "../db/database";
import { applications, categories, statusLogs } from "../db/schema";
import { eq } from "drizzle-orm";

export default function InsightsScreen({ route }) {
  const userId = route?.params?.userId || 1;
  const [apps, setApps] = useState([]);
  const [cats, setCats] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function loadData() {
      const a = await db.select().from(applications).where(eq(applications.userId, userId));
      const c = await db.select().from(categories).where(eq(categories.userId, userId));
      const l = await db.select().from(statusLogs);
      setApps(a);
      setCats(c);
      setLogs(l);
    }
    loadData();
  }, []);

  const statusCounts = {};
  logs.forEach(log => {
    statusCounts[log.status] = (statusCounts[log.status] || 0) + 1;
  });

  const categoryCounts = {};
  apps.forEach(app => {
    categoryCounts[app.categoryId] = (categoryCounts[app.categoryId] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(categoryCounts), 1);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Insights</Text>

      <Text style={styles.sectionTitle}>Total Applications</Text>
      <Text style={styles.bigNumber}>{apps.length}</Text>

      <Text style={styles.sectionTitle}>Applications by Status</Text>
      {Object.entries(statusCounts).map(([status, count]) => (
        <View key={status} style={styles.statRow}>
          <Text style={styles.statLabel}>{status}</Text>
          <Text style={styles.statCount}>{count}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Applications by Category</Text>
      {cats.map(cat => {
        const count = categoryCounts[cat.id] || 0;
        const barWidth = `${(count / maxCount) * 100}%`;
        return (
          <View key={cat.id} style={styles.barRow}>
            <Text style={styles.barLabel}>{cat.icon} {cat.name}</Text>
            <View style={styles.barBackground}>
              <View style={[styles.barFill, { width: barWidth, backgroundColor: cat.colour }]} />
            </View>
            <Text style={styles.barCount}>{count}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#2e7d32", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333", marginTop: 20, marginBottom: 10 },
  bigNumber: { fontSize: 48, fontWeight: "bold", color: "#2e7d32", textAlign: "center", marginBottom: 10 },
  statRow: { flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: "#f4faf6", borderRadius: 8, marginBottom: 6 },
  statLabel: { fontSize: 14, color: "#444" },
  statCount: { fontSize: 14, fontWeight: "bold", color: "#2e7d32" },
  barRow: { marginBottom: 12 },
  barLabel: { fontSize: 14, color: "#444", marginBottom: 4 },
  barBackground: { height: 16, backgroundColor: "#eee", borderRadius: 8, marginBottom: 2 },
  barFill: { height: 16, borderRadius: 8 },
  barCount: { fontSize: 12, color: "#888" },
});