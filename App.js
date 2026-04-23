import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initDB } from "./db/database";
import { seedDatabase } from "./db/seed";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ApplicationsScreen from "./screens/ApplicationsScreen";
import AddApplicationScreen from "./screens/AddApplicationScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import TargetsScreen from "./screens/TargetsScreen";
import InsightsScreen from "./screens/InsightsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs({ userId, onLogout }) {
  return (
    <Tab.Navigator>
      {/* passing userId down this way was the quickest option for now */}
      <Tab.Screen name="Applications">
        {props => <ApplicationsScreen {...props} route={{ ...props.route, params: { ...props.route.params, userId } }} />}
      </Tab.Screen>
      <Tab.Screen name="Categories">
        {props => <CategoriesScreen {...props} route={{ ...props.route, params: { ...props.route.params, userId } }} />}
      </Tab.Screen>
      <Tab.Screen name="Targets">
        {props => <TargetsScreen {...props} route={{ ...props.route, params: { ...props.route.params, userId } }} />}
      </Tab.Screen>
      <Tab.Screen name="Insights">
        {props => <InsightsScreen {...props} onLogout={onLogout} route={{ ...props.route, params: { ...props.route.params, userId } }} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [startupError, setStartupError] = useState(null);

  useEffect(() => {
    async function setup() {
      try {
        // just making sure the db exists before the app tries to use it
        await initDB();
        await seedDatabase();
        setReady(true);
      } catch (error) {
        console.error("App startup failed:", error);
        setStartupError(error);
      }
    }
    setup();
  }, []);

  if (startupError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>The app could not finish starting.</Text>
        <Text style={styles.message}>
          Check the Metro terminal for the full error. The startup database setup
          did not complete.
        </Text>
        <Text style={styles.errorText}>
          {startupError?.message || String(startupError)}
        </Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.message}>Starting JobTracker...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!userId ? (
          <>
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} onLogin={(id) => setUserId(id)} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main">
              {props => <MainTabs {...props} userId={userId} onLogout={() => setUserId(null)} />}
            </Stack.Screen>
            <Stack.Screen name="AddApplication">
              {props => <AddApplicationScreen {...props} userId={userId} />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: "#4b5563",
    textAlign: "center",
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: "#b91c1c",
    textAlign: "center",
    marginTop: 16,
  },
});
