import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import BottomTabBar from '../components/BottomTabBar';

export function BuscarScreen() {
    // Mock data for search results
    const categories = [
        'Desayuno', 'Almuerzo', 'Cena', 'Postres', 'Vegano',
        'Sin TACC', 'Rápido', 'Saludable'
    ];

    const popularRecipes = [
        {id: 1, name: 'Tortilla de papa', category: 'Cena'},
        {id: 2, name: 'Ensalada César', category: 'Almuerzo'},
        {id: 3, name: 'Pancakes', category: 'Desayuno'},
    ];

    // @ts-ignore
    return (
        <View style={styles.container}>
            {/*<Header title="Buscar"/>*/}

            <ScrollView style={styles.content}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon}/>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar recetas, ingredientes..."
                        placeholderTextColor="#999"
                    />
                </View>


                {/* Categories */}
                <Text style={styles.sectionTitle}>Categorías</Text>
                <View style={styles.categoriesContainer}>
                    {categories.map((category, index) => (
                        <TouchableOpacity key={index} style={styles.categoryChip}>
                            <Text style={styles.categoryText}>{category}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Popular Searches */}
                <Text style={styles.sectionTitle}>Búsquedas populares</Text>
                <View style={styles.popularContainer}>
                    {popularRecipes.map((recipe) => (
                        <TouchableOpacity key={recipe.id} style={styles.recipeItem}>
                            <Text style={styles.recipeName}>{recipe.name}</Text>
                            <Text style={styles.recipeCategory}>{recipe.category}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <BottomTabBar/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 50,
        color: '#333',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    categoryChip: {
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 10,
        marginBottom: 10,
    },
    categoryText: {
        color: '#4C5F00',
        fontSize: 14,
    },
    popularContainer: {
        marginBottom: 20,
    },
    recipeItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    recipeName: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    recipeCategory: {
        fontSize: 12,
        color: '#999',
    },
});
