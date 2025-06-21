import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock data - replace with actual data from your API
const MOCK_FAVORITES = [
  {
    id: '1',
    title: 'Pasta Carbonara',
    image: 'https://picsum.photos/200/300?random=1',
    category: 'Italiana',
    time: '30 min',
  },
  {
    id: '2',
    title: 'Ensalada César',
    image: 'https://picsum.photos/200/300?random=2',
    category: 'Ensaladas',
    time: '15 min',
  },
  {
    id: '3',
    title: 'Tacos al Pastor',
    image: 'https://picsum.photos/200/300?random=3',
    category: 'Mexicana',
    time: '45 min',
  },
];

export default function FavoritesScreen() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.recipeCard}
      onPress={() => router.push(`/receta/${item.id}`)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.recipeImage}
        resizeMode="cover"
      />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.recipeMeta}>
          <Text style={styles.recipeCategory}>{item.category}</Text>
          <View style={styles.recipeTime}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.recipeTimeText}>{item.time}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.favoriteButton}>
        <Ionicons name="heart" size={24} color="#FF5252" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus Favoritos</Text>
      
      {MOCK_FAVORITES.length > 0 ? (
        <FlatList
          data={MOCK_FAVORITES}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-dislike-outline" size={64} color="#CCCCCC" />
          <Text style={styles.emptyText}>No tienes recetas favoritas aún</Text>
          <Text style={styles.emptySubtext}>Guarda tus recetas favoritas para encontrarlas fácilmente</Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => router.push('/buscar')}
          >
            <Text style={styles.exploreButtonText}>Explorar Recetas</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8DC',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeImage: {
    width: 100,
    height: '100%',
  },
  recipeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeCategory: {
    fontSize: 12,
    color: '#4C5F00',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  recipeTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeTimeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  favoriteButton: {
    padding: 16,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#4C5F00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
