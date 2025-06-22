import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="recuperarPassword" />
      <Stack.Screen name="homeScreen" />
      <Stack.Screen name="perfil" />
      <Stack.Screen name="favoritos" />
      <Stack.Screen name="editarPerfil" />
    </Stack>
  );
}