import { Stack } from "expo-router";
import { useState } from "react";

const Authlayout = () => {
    const [isLoggedin, setIsLoggedIn] = useState(false);
    
  return (
    <Stack screenOptions={{
      headerShown: false
    }}>
      {isLoggedin ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)/signup" />
      )}
</Stack>

  );
}