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

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Applications" component={ApplicationsScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Targets" component={TargetsScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

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
        {!loggedIn ? (
          <>
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} onLogin={() => setLoggedIn(true)} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="AddApplication" component={AddApplicationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}