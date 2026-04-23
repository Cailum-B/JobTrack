import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { db } from "../db/database";
import { categories } from "../db/schema";
import { eq } from "drizzle-orm";

const COLOURS = ["#4caf7f", "#2196F3", "#FF9800", "#9C27B0", "#F44336", "#00BCD4"];
const ICONS = ["T", "F", "C", "G", "M", "B"];

export default function CategoriesScreen({ route }) {
  const userId = route?.params?.userId || 1;
  const [cats, setCats] = useState([]);
  const [name, setName] = useState("");
  const [colour, setColour] = useState(COLOURS[0]);
  const [icon, setIcon] = useState(ICONS[0]);
  const [editingId, setEditingId] = useState(null);

  async function loadCategories() {
    const result = await db.select().from(categories).where(eq(categories.userId, userId));
    setCats(result);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleSave() {
    if (!name) {
      Alert.alert("Please enter a category name");
      return;
    }
    if (editingId) {
      await db.update(categories).set({ name, colour, icon }).where(eq(categories.id, editingId));
      setEditingId(null);
    } else {
      await db.insert(categories).values({ name, colour, icon, userId });
    }
    setName("");
    loadCategories();
  }

  async function handleDelete(id) {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete", onPress: async () => {
          await db.delete(categories).where(eq(categories.id, id));
          loadCategories();
        }
      }
    ]);
  }

  function handleEdit(cat) {
    setEditingId(cat.id);
    setName(cat.name);
    setColour(cat.colour);
    setIcon(cat.icon);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <TextInput
        style={styles.input}
        placeholder="Category name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Colour</Text>
      <View style={styles.row}>
        {COLOURS.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.colourDot, { backgroundColor: c }, colour === c && styles.selected]}
            onPress={() => setColour(c)}
          />
        ))}
      </View>
      <Text style={styles.label}>Icon</Text>
      <View style={styles.row}>
        {ICONS.map(i => (
          <TouchableOpacity
            key={i}
            style={[styles.iconButton, icon === i && styles.selected]}
            onPress={() => setIcon(i)}
          >
            <Text style={{ fontSize: 16 }}>{i}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{editingId ? "Update" : "Add Category"}</Text>
      </TouchableOpacity>
      <FlatList
        data={cats}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.colourBar, { backgroundColor: item.colour }]} />
            <Text style={styles.catName}>{item.icon} {item.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.editBtn}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteBtn}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#2e7d32", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  label: { fontSize: 14, color: "#444", marginBottom: 6 },
  row: { flexDirection: "row", marginBottom: 10, flexWrap: "wrap" },
  colourDot: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  iconButton: { padding: 6, marginRight: 8, borderRadius: 8, borderWidth: 1, borderColor: "#ccc" },
  selected: { borderWidth: 3, borderColor: "#2e7d32" },
  button: { backgroundColor: "#2e7d32", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#f4faf6", borderRadius: 8, marginBottom: 8, overflow: "hidden" },
  colourBar: { width: 8, height: "100%", minHeight: 48 },
  catName: { flex: 1, fontSize: 16, padding: 12 },
  actions: { flexDirection: "row", padding: 8 },
  editBtn: { color: "#2e7d32", marginRight: 12, fontWeight: "bold" },
  deleteBtn: { color: "#c0392b", fontWeight: "bold" },
});
