import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { QueryProvider } from '@/providers/QueryProvider';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { authState } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // @ts-ignore
    const inAuthGroup = segments[0] === '(auth)';
    const inAdminGroup = segments[0] === 'admin';

    if (!authState.isLoading) {
      if (!authState.isAuthenticated && !inAuthGroup) {
        // Redirect to login if not authenticated and not in auth group
        router.replace('/login');
      } else if (authState.isAuthenticated) {
        if (inAuthGroup) {
          // Redirect to home if authenticated and in auth group
          router.replace('/(tabs)/homeScreen');
        } else if (inAdminGroup && !authState.isAdmin) {
          // Redirect to home if not admin trying to access admin routes
          router.replace('/(tabs)/homeScreen');
        }
      }
      SplashScreen.hideAsync();
    }
  }, [authState.isAuthenticated, authState.isLoading, authState.isAdmin, segments, router]);

  if (authState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4C5F00" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#fff' },
    }}>
      {/* Public routes */}
      <Stack.Screen name="login" options={{ title: 'Iniciar Sesión' }} />
      
      {/* Protected routes */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="admin" options={{ headerShown: false }} />
      <Stack.Screen name="perfil" options={{ title: 'Mi Perfil' }} />
      <Stack.Screen name="editarPerfil" options={{ title: 'Editar Perfil' }} />
      <Stack.Screen name="agregar-receta" options={{ title: 'Agregar Receta' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryProvider>
      <AuthProvider>
        <View style={styles.container} onLayout={onLayoutRootView}>
          <RootLayoutNav />
        </View>
      </AuthProvider>
    </QueryProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
