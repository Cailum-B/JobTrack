import { useEffect, useState } from "react";
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

  useEffect(() => {
    async function setup() {
      await initDB();
      await seedDatabase();
      setReady(true);
    }
    setup();
  }, []);

  if (!ready) return null;

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