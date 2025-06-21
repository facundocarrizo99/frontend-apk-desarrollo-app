import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect } from 'react';

export function HomeScreen() {
  const {user, isAdmin} = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user]);

  if (!user) {
    return null; // Or a loading indicator
  }

  return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.welcomeText}>
            ¡Bienvenido{user.name ? `, ${user.name}` : ''}!
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Tus Recetas</Text>
            <Text style={styles.cardText}>
              Aquí podrás ver y gestionar tus recetas guardadas.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recomendaciones</Text>
            <Text style={styles.cardText}>
              Descubre nuevas recetas basadas en tus gustos.
            </Text>
          </View>

          {isAdmin && (
              <View style={[styles.card, styles.adminCard]}>
                <Text style={styles.cardTitle}>Panel de Administrador</Text>
                <Text style={styles.cardText}>
                  Accede a las herramientas de administración.
                </Text>
              </View>
          )}
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8DC',
  },
  content: {
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1A1A1A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  cardText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  adminCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4C5F00',
  },
});
