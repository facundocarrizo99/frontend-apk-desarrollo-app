import { Stack } from "expo-router";
// import AuthGuard from "../components/AuthGuard"; // Comentado temporalmente
import ErrorBoundary from "../components/ErrorBoundary";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      {/* <AuthGuard> // Comentado temporalmente */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="recuperarPassword" />
        <Stack.Screen name="verificarCodigo" />
        <Stack.Screen name="cambiarPassword" />
        <Stack.Screen name="homeScreen" />
        <Stack.Screen name="perfil" />
        <Stack.Screen name="favoritos" />
        <Stack.Screen name="editarPerfil" />
        <Stack.Screen name="aprobarRecetas" />
        <Stack.Screen name="aprobarComentarios" />
        <Stack.Screen name="crearReceta" />
        <Stack.Screen name="buscarReceta" />
        <Stack.Screen name="recipeDetail" />
      </Stack>
      {/* </AuthGuard> // Comentado temporalmente */}
    </ErrorBoundary>
  );
}
