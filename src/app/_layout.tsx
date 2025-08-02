// src/app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { TaskProvider, useTask } from "@/context/TaskContext";
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { ActivityIndicator, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "@/components/Themed";


function LayoutWithGuard() {
  const { token, setToken } = useTask();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    
    const checkToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
      setLoading(false);
    };

    checkToken();
  }, []);


    if (loading) {
    // Show spinner while checking token
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
        <Stack.Protected guard={token !== null}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack.Protected>

          <Stack.Protected guard={token === null}>
            <Stack.Screen
              name="(auth)/login"
              options={{ headerShown: false }}
            />
          </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  

  // console.log(isLoggedIn, "isLoggedIn");
  return (
    <TaskProvider>
      <ThemeProvider value={ DefaultTheme}>
        <LayoutWithGuard />
      </ThemeProvider>
    </TaskProvider>
  );
}
