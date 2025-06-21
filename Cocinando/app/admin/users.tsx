import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';
import BottomTabBar from '../../components/BottomTabBar';
import ProtectedRoute from '../../components/ProtectedRoute';

// Mock data - replace with actual API call
const MOCK_USERS = [
  {
    id: '1',
    name: 'María González',
    email: 'maria@ejemplo.com',
    role: 'admin',
    status: 'active',
    joinDate: '15/03/2023',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '2',
    name: 'Carlos López',
    email: 'carlos@ejemplo.com',
    role: 'user',
    status: 'active',
    joinDate: '22/05/2023',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana@ejemplo.com',
    role: 'user',
    status: 'suspended',
    joinDate: '10/01/2023',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    id: '4',
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    role: 'user',
    status: 'active',
    joinDate: '05/04/2023',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
];

export default function AdminUsers() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(MOCK_USERS);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Image 
          source={{ uri: item.avatar }} 
          style={styles.avatar} 
          defaultSource={require('../../assets/default-avatar.png')}
        />
        <View style={styles.userDetails}>
          <View style={styles.userHeader}>
            <Text style={styles.userName} numberOfLines={1}>
              {item.name}
              {item.role === 'admin' && (
                <Ionicons name="shield-checkmark" size={16} color="#4C5F00" style={styles.roleIcon} />
              )}
            </Text>
            <View style={[
              styles.statusBadge,
              item.status === 'active' ? styles.statusActive : styles.statusSuspended
            ]}>
              <Text style={styles.statusText}>
                {item.status === 'active' ? 'Activo' : 'Suspendido'}
              </Text>
            </View>
          </View>
          <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
          <Text style={styles.joinDate}>Se unió el {item.joinDate}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[
            styles.actionButton,
            item.status === 'active' ? styles.suspendButton : styles.activateButton
          ]}
          onPress={() => toggleUserStatus(item.id)}
          disabled={item.id === currentUser?.id}
        >
          <Ionicons 
            name={item.status === 'active' ? 'pause-circle' : 'play-circle'} 
            size={20} 
            color={item.id === currentUser?.id ? '#CCCCCC' : (item.status === 'active' ? '#D32F2F' : '#4C5F00')} 
          />
          <Text style={[
            styles.actionButtonText,
            { 
              color: item.id === currentUser?.id ? '#CCCCCC' : (item.status === 'active' ? '#D32F2F' : '#4C5F00') 
            }
          ]}>
            {item.status === 'active' ? 'Suspender' : 'Activar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push(`/admin/users/${item.id}`)}
        >
          <Ionicons name="create-outline" size={20} color="#2196F3" />
          <Text style={[styles.actionButtonText, { color: '#2196F3' }]}>
            Editar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ProtectedRoute adminOnly>
      <View style={styles.container}>
        <Header 
          title="Gestionar Usuarios" 
          showBack={true} 
          onBackPress={() => router.back()} 
        />
        
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9E9E9E" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9E9E9E"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
              >
                <Ionicons name="close-circle" size={18} color="#9E9E9E" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{users.filter(u => u.status === 'active').length}</Text>
              <Text style={styles.statLabel}>Activos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{users.filter(u => u.status === 'suspended').length}</Text>
              <Text style={styles.statLabel}>Suspendidos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{users.filter(u => u.role === 'admin').length}</Text>
              <Text style={styles.statLabel}>Administradores</Text>
            </View>
          </View>

          <FlatList
            data={filteredUsers}
            renderItem={renderUserItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.userList}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color="#E0E0E0" />
                <Text style={styles.emptyText}>No se encontraron usuarios</Text>
                <Text style={styles.emptySubtext}>Intenta con otro término de búsqueda</Text>
              </View>
            }
          />
        </View>
        
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1A1A1A',
  },
  clearButton: {
    padding: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4C5F00',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  userList: {
    paddingBottom: 16,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 8,
  },
  roleIcon: {
    marginLeft: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  joinDate: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 'auto',
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
  },
  statusSuspended: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusActiveText: {
    color: '#2E7D32',
  },
  statusSuspendedText: {
    color: '#D32F2F',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  suspendButton: {
    borderColor: '#FFCDD2',
    backgroundColor: '#FFEBEE',
  },
  activateButton: {
    borderColor: '#C8E6C9',
    backgroundColor: '#E8F5E9',
  },
  actionButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9E9E9E',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BDBDBD',
    marginTop: 4,
  },
});
