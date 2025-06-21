import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useIsAdmin } from '../contexts/AuthContext';

interface TabItem {
  icon: string;
  label: string;
  route: string;
  adminOnly?: boolean;
}

export default function BottomTabBar() {
  const router = useRouter();
  const isAdmin = useIsAdmin();

  // Define tabs for regular users
  const userTabs: TabItem[] = [
    { icon: 'home', label: 'Inicio', route: '/homeScreen' },
    { icon: 'search', label: 'Buscar', route: '/buscar' },
    { icon: 'add-circle', label: 'Añadir', route: '/agregar-receta' },
    { icon: 'heart', label: 'Favoritos', route: '/favoritos' },
    { icon: 'person', label: 'Mi perfil', route: '/perfil' },
  ];

  // Define tabs for admin users
  const adminTabs: TabItem[] = [
    { icon: 'home', label: 'Inicio', route: '/homeScreen' },
    { icon: 'search', label: 'Buscar', route: '/buscar' },
    { icon: 'shield', label: 'Admin', route: '/admin' },
    { icon: 'heart', label: 'Favoritos', route: '/favoritos' },
    { icon: 'person', label: 'Perfil', route: '/perfil' },
  ];

  const tabs = isAdmin ? adminTabs : userTabs;

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <Tab 
          key={tab.route}
          icon={tab.icon}
          label={tab.label}
          onPress={() => router.push(tab.route as any)}
        />
      ))}
    </View>
  );
}

function Tab({ 
  icon, 
  label, 
  onPress 
}: { 
  icon: string; 
  label: string; 
  onPress: () => void;
}) {
  return (
    <TouchableOpacity 
      style={styles.tab} 
      onPress={onPress}
    >
      <Ionicons name={icon as any} size={24} color="#4C5F00" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F8DC',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    tab: {
        alignItems: 'center',
    },
    label: {
        fontSize: 10,
        color: '#4C5F00',
    },
});