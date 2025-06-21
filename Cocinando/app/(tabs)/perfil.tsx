import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth, useCurrentUser, useIsAdmin } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { User } from '@/types/api';

export default function ProfileScreen() {
  const { logout, refreshUser } = useAuth();
  const user: User | null = useCurrentUser();
  const isAdmin = useIsAdmin();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [refreshUser]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.unauthorizedContainer]}>
        <Text>Please log in to view your profile</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get user avatar or fallback to default
  const avatarSource = user.avatar ? { uri: user.avatar } : require('@/assets/default-avatar.png');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={avatarSource}
            style={styles.avatar}
            defaultSource={require('../../assets/default-avatar.png')}
            onError={(e) => {
              console.log('Error loading avatar:', e.nativeEvent.error);
              // Fallback to default avatar if there's an error loading the user's avatar
              //e.target.source = require('../../assets/default-avatar.png');
            }}
          />
          {isAdmin && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" testID="admin-badge" />
            </View>
          )}
        </View>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {user.name || 'Usuario'}
        </Text>
        <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
          {user.email}
        </Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push({
            pathname: '/editarPerfil',
            params: { userId: user.id }
          })}
          testID="edit-profile-button"
        >
          <Ionicons name="person-outline" size={24} color="#4C5F00" />
          <Text style={styles.menuText}>Editar Perfil</Text>
          <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="heart-outline" size={24} color="#4C5F00" />
          <Text style={styles.menuText}>Mis Favoritos</Text>
          <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color="#4C5F00" />
          <Text style={styles.menuText}>Configuración</Text>
          <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#D32F2F" />
          <Text style={[styles.menuText, { color: '#D32F2F' }]}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8DC',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  unauthorizedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#4C5F00',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4C5F00',
  },
  adminBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4C5F00',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666666',
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  logoutButton: {
    marginTop: 24,
    borderBottomWidth: 0,
    justifyContent: 'center',
  },
});
