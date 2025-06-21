import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';
import BottomTabBar from '../../components/BottomTabBar';
import ProtectedRoute from '../../components/ProtectedRoute';

interface AdminAction {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen: string;
  color: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const adminActions: AdminAction[] = [
    { 
      title: 'Gestionar Recetas', 
      icon: 'restaurant',
      screen: 'admin/recipes',
      color: '#4C5F00'
    },
    { 
      title: 'Gestionar Usuarios', 
      icon: 'people',
      screen: 'admin/users',
      color: '#2196F3'
    },
    { 
      title: 'Estadísticas', 
      icon: 'stats-chart',
      screen: 'admin/stats',
      color: '#9C27B0'
    },
    { 
      title: 'Reportes', 
      icon: 'document-text',
      screen: 'admin/reports',
      color: '#FF9800'
    },
    { 
      title: 'Configuración', 
      icon: 'settings',
      screen: 'admin/settings',
      color: '#607D8B'
    },
  ];

  return (
    <ProtectedRoute adminOnly>
      <View style={styles.container}>
        <Header title="Panel de Administración" showBack={false} />
        
        <ScrollView style={styles.content}>
          {/* User Info Card */}
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <Image 
                source={user?.avatar ? { uri: user.avatar } : require('../../assets/default-avatar.png')} 
                style={styles.avatar} 
                defaultSource={require('../../assets/default-avatar.png')}
              />
              <View style={styles.userText}>
                <Text style={styles.userName}>{user?.name || 'Administrador'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <View style={styles.adminBadge}>
                  <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
                  <Text style={styles.adminText}>Administrador</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Herramientas de Administración</Text>
          
          <View style={styles.grid}>
            {adminActions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.card, { borderLeftColor: action.color }]}
                onPress={() => router.push(`/${action.screen}` as any)}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={styles.cardTitle}>{action.title}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9E9E9E" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>1,245</Text>
              <Text style={styles.statLabel}>Usuarios</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>856</Text>
              <Text style={styles.statLabel}>Recetas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Reportes</Text>
            </View>
          </View>
        </ScrollView>
        
        <BottomTabBar />
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8DC',
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 80,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#4C5F00',
  },
  userText: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4C5F00',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 6,
  },
  adminText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4C5F00',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4C5F00',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});
