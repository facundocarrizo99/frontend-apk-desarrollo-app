import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { AlertModal } from '../components/AlertModal';
import BottomTabBar from '../components/BottomTabBar';
import Header from '../components/Header';
import { Recipe } from '../types/Recipie';
import { RecipesService } from '../utils/recipesService';
import { useAlert } from '../utils/useAlert';
import { useAuthGuard } from '../utils/useAuthGuard';
import { useFavorites } from '../utils/useFavorites';

export default function HomeScreen() {
    // Proteger la ruta
    useAuthGuard();
    
    const [searchText, setSearchText] = useState<string>('');
    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [isOffline, setIsOffline] = useState(false);
    
    // Hook para manejar favoritos
    const { toggleFavorite, isFavorite, error: favoritesError } = useFavorites();
    
    // Hook para alertas
    const { alertState, showError, hideAlert, handleConfirm, handleCancel } = useAlert();

    // Helper para deduplicar recetas por _id
    const deduplicateRecipes = (recipes: Recipe[]): Recipe[] => {
        const seen = new Set();
        return recipes.filter(recipe => {
            if (seen.has(recipe._id)) return false;
            seen.add(recipe._id);
            return true;
        });
    };

    // Cargar recetas al montar el componente
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOffline(!(state.isConnected && state.isInternetReachable));
        });
        loadRecipes();
        return () => unsubscribe();
    }, []);

    // Guardar las primeras 3 recetas para uso offline
    useEffect(() => {
        if (allRecipes.length > 0 && !isOffline) {
            AsyncStorage.setItem('offlineRecipes', JSON.stringify(allRecipes.slice(0, 3)));
        }
    }, [allRecipes, isOffline]);

    // Cargar y combinar recetas offline (recetas, favoritos, misRecetas)
    useEffect(() => {
        if (isOffline) {
            (async () => {
                const [r, f, m] = await Promise.all([
                    AsyncStorage.getItem('offlineRecipes'),
                    AsyncStorage.getItem('offlineFavorites'),
                    AsyncStorage.getItem('offlineMyRecipes'),
                ]);
                const recipes = r ? JSON.parse(r) : [];
                const favorites = f ? JSON.parse(f) : [];
                const myRecipes = m ? JSON.parse(m) : [];
                // Only show approved recipes
                const merged = deduplicateRecipes([...recipes, ...favorites, ...myRecipes]).filter(r => r.aprobado === true);
                setAllRecipes(merged);
                setFilteredRecipes(merged);
            })();
        }
    }, [isOffline]);

    const loadRecipes = async () => {
        setLoading(true);
        setError('');
        try {
            const netState = await NetInfo.fetch();
            if (!(netState.isConnected && netState.isInternetReachable)) {
                // Sin conexión: cargar recetas guardadas (ahora hecho en useEffect arriba)
                setLoading(false);
                return;
            }
            const result = await RecipesService.getApprovedRecipes();
            if (result.success && result.recipes) {
                setAllRecipes(result.recipes);
                setFilteredRecipes(result.recipes);
            } else {
                setError(result.error || 'Error al cargar recetas');
                setAllRecipes([]);
                setFilteredRecipes([]);
            }
        } catch (err) {
            setError('Error de conexión');
            setAllRecipes([]);
            setFilteredRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const results = RecipesService.searchRecipes(allRecipes, searchText);
        setFilteredRecipes(results);
    };

    const clearSearch = () => {
        setSearchText('');
        setFilteredRecipes(allRecipes);
    };

    // Función para obtener el avatar del autor con fallback
    const getAuthorAvatar = (recipe: Recipe): string => {
        return recipe.autor?.avatar || recipe.author?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg';
    };

    // Función para obtener el nombre del autor con fallback
    const getAuthorName = (recipe: Recipe): string => {
        return recipe.autor?.name || recipe.author?.name || 'Autor desconocido';
    };

    // Función para obtener el título de la receta con fallback
    const getRecipeTitle = (recipe: Recipe): string => {
        return recipe.titulo || recipe.title || 'Sin título';
    };

    // Función para obtener la imagen de la receta con fallback
    const getRecipeImage = (recipe: Recipe): string => {
        return recipe.imagen || recipe.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    };

    // Función para navegar al detalle de la receta
    const handleRecipePress = (recipe: Recipe) => {
        router.push({
            pathname: '/recipeDetail',
            params: {
                id: recipe._id,
                titulo: recipe.titulo || recipe.title || '',
                descripcion: recipe.descripcion || '',
                imagen: getRecipeImage(recipe),
                autor: JSON.stringify(recipe.autor),
                ingredientes: recipe.ingredientes ? JSON.stringify(recipe.ingredientes) : '[]',
                pasos: recipe.pasos ? JSON.stringify(recipe.pasos) : '[]',
                cantidadComensales: recipe.cantidadComensales?.toString() || '1',
                tags: recipe.tags ? JSON.stringify(recipe.tags) : '[]',
                valoracionPromedio: recipe.valoracionPromedio?.toString() || '0',
                fechaCreacion: recipe.fechaCreacion || '',
                fechaModificacion: recipe.fechaModificacion || '',
            },
        });
    };

    // Función para manejar el toggle de favoritos
    const handleFavoritePress = async (recipe: Recipe, event: any) => {
        // Evitar que se ejecute el onPress de la receta
        event.stopPropagation();
        
        const newFavoriteStatus = await toggleFavorite(recipe._id);
        
        if (favoritesError) {
            showError(favoritesError);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Header />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4C5F00" />
                    <Text style={styles.loadingText}>Cargando recetas...</Text>
                </View>
                <BottomTabBar />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Mostrar error si existe */}
                {error && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="warning-outline" size={20} color="#d32f2f" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={loadRecipes} style={styles.retryButton}>
                            <Text style={styles.retryText}>Reintentar</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Barra de búsqueda */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Buscar recetas, autor, ingrediente..."
                            style={styles.searchInput}
                            value={searchText}
                            onChangeText={setSearchText}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        {searchText.length > 0 && (
                            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                                <Ionicons name="close-circle" size={20} color="#666" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Ionicons name="search" size={16} color="white" />
                        <Text style={styles.searchButtonText}>Buscar</Text>
                    </TouchableOpacity>
                </View>

                {/* Título de sección */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        {searchText ? `Resultados para "${searchText}"` : 'Recetas Aprobadas'}
                    </Text>
                    <Text style={styles.resultCount}>
                        {filteredRecipes.length} {filteredRecipes.length === 1 ? 'receta' : 'recetas'}
                    </Text>
                </View>

                {/* Lista de recetas */}
                {filteredRecipes.length > 0 ? (
                    <View style={styles.recipesContainer}>
                        {filteredRecipes.map((recipe) => (
                            <TouchableOpacity 
                                key={recipe._id} 
                                style={styles.recipeCard} 
                                onPress={() => handleRecipePress(recipe)}
                            >
                                <ImageBackground 
                                    source={{ uri: getRecipeImage(recipe) }} 
                                    style={styles.recipeBackground}
                                    imageStyle={styles.recipeBackgroundImage}
                                >
                                    {/* Botón de favoritos */}
                                    <TouchableOpacity 
                                        style={styles.favoriteButton}
                                        onPress={(event) => handleFavoritePress(recipe, event)}
                                    >
                                        <Ionicons 
                                            name={isFavorite(recipe._id) ? "heart" : "heart-outline"} 
                                            size={24} 
                                            color={isFavorite(recipe._id) ? "#FF6B6B" : "white"} 
                                        />
                                    </TouchableOpacity>

                                    {/* Footer con nombre de la receta y autor */}
                                    <View style={styles.recipeFooter}>
                                        <View style={styles.recipeInfo}>
                                            <Text style={styles.recipeTitle}>{getRecipeTitle(recipe)}</Text>
                                            <View style={styles.authorInfo}>
                                                <Image 
                                                    source={{ uri: getAuthorAvatar(recipe) }} 
                                                    style={styles.authorAvatar} 
                                                />
                                                <Text style={styles.authorName}>Por {getAuthorName(recipe)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={styles.noResultsContainer}>
                        <Ionicons name="search" size={48} color="#ccc" />
                        <Text style={styles.noResultsTitle}>No se encontraron recetas</Text>
                        <Text style={styles.noResultsText}>
                            {searchText ? 'Intenta con otros términos de búsqueda' : 'No hay recetas disponibles'}
                        </Text>
                        {searchText && (
                            <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
                                <Text style={styles.clearSearchText}>Ver todas las recetas</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </ScrollView>

            <BottomTabBar />
            
            {/* Modal de Alertas */}
            <AlertModal
                alertState={alertState}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                onClose={hideAlert}
            />
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
        padding: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    },
    loadingText: {
        fontSize: 16,
        color: '#4C5F00',
        fontWeight: '500',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffebee',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        gap: 8,
    },
    errorText: {
        flex: 1,
        color: '#d32f2f',
        fontSize: 14,
    },
    retryButton: {
        backgroundColor: '#d32f2f',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    },
    retryText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#F0F0E0',
        borderRadius: 25,
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
        color: '#333',
    },
    clearButton: {
        marginLeft: 5,
    },
    searchButton: {
        backgroundColor: '#4C5F00',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 25,
        gap: 5,
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#4C5F00',
    },
    resultCount: {
        fontSize: 14,
        color: '#666',
    },
    recipesContainer: {
        gap: 15,
        paddingBottom: 20,
    },
    recipeCard: {
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    recipeBackground: {
        width: '100%',
        height: 200,
        justifyContent: 'flex-end',
    },
    recipeBackgroundImage: {
        borderRadius: 15,
    },
    recipeFooter: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    recipeInfo: {
        gap: 8,
    },
    recipeTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    authorAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fff',
    },
    authorName: {
        color: '#fff',
        fontSize: 12,
        opacity: 0.9,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    noResultsContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    noResultsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4C5F00',
        marginTop: 15,
        marginBottom: 5,
    },
    noResultsText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    clearSearchButton: {
        backgroundColor: '#4C5F00',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    clearSearchText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    favoriteButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 8,
        zIndex: 1,
    },
});