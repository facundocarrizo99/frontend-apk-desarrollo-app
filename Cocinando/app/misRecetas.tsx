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
import { UserManager } from '../utils/userManager';

export default function MisRecetasScreen() {
    useAuthGuard();
    const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [isOffline, setIsOffline] = useState(false);
    const [offlineMyRecipes, setOfflineMyRecipes] = useState<Recipe[]>([]);

    // Favoritos (opcional, igual que en homeScreen)
    const { toggleFavorite, isFavorite, error: favoritesError } = useFavorites();
    const { alertState, showError, hideAlert, handleConfirm, handleCancel } = useAlert();

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsOffline(!(state.isConnected && state.isInternetReachable));
        });
        loadMyRecipes();
        return () => unsubscribe();
    }, []);

    // Guardar los primeros 10 de mis recetas para uso offline
    useEffect(() => {
        if (myRecipes.length > 0 && !isOffline) {
            AsyncStorage.setItem('offlineMyRecipes', JSON.stringify(myRecipes.slice(0, 10)));
        }
    }, [myRecipes, isOffline]);

    // Cargar mis recetas offline si no hay conexión
    useEffect(() => {
        if (isOffline) {
            AsyncStorage.getItem('offlineMyRecipes').then(stored => {
                setOfflineMyRecipes(stored ? JSON.parse(stored) : []);
            });
        }
    }, [isOffline]);

    const loadMyRecipes = async () => {
        setLoading(true);
        setError('');
        try {
            const netState = await NetInfo.fetch();
            if (!(netState.isConnected && netState.isInternetReachable)) {
                // Sin conexión: cargar recetas guardadas
                const stored = await AsyncStorage.getItem('offlineMyRecipes');
                const offline = stored ? JSON.parse(stored) : [];
                setMyRecipes(offline);
                setLoading(false);
                return;
            }
            const result = await RecipesService.getUserRecipes(UserManager.getCurrentUser()?._id || '');
            if (result.success && result.recipes) {
                setMyRecipes(result.recipes);
            } else {
                setError(result.error || 'Error al cargar tus recetas');
                setMyRecipes([]);
            }
        } catch (err) {
            setError('Error de conexión');
            setMyRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    // Avatar y nombre del autor (debería ser el usuario logueado, pero por consistencia)
    const getAuthorAvatar = (recipe: Recipe): string => {
        return recipe.autor?.avatar || recipe.author?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg';
    };
    const getAuthorName = (recipe: Recipe): string => {
        return recipe.autor?.name || recipe.author?.name || 'Tú';
    };
    const getRecipeTitle = (recipe: Recipe): string => {
        return recipe.titulo || recipe.title || 'Sin título';
    };
    const getRecipeImage = (recipe: Recipe): string => {
        return recipe.imagen || recipe.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
    };

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

    const handleFavoritePress = async (recipe: Recipe, event: any) => {
        event.stopPropagation();
        await toggleFavorite(recipe._id);
        if (favoritesError) {
            showError(favoritesError);
        }
    };

    const recipesToShow = isOffline ? offlineMyRecipes : myRecipes;

    if (loading) {
        return (
            <View style={styles.container}>
                <Header />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4C5F00" />
                    <Text style={styles.loadingText}>Cargando tus recetas...</Text>
                </View>
                <BottomTabBar />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Mis Recetas</Text>
                    <Text style={styles.resultCount}>
                        {recipesToShow.length} {recipesToShow.length === 1 ? 'receta' : 'recetas'}
                    </Text>
                </View>
                {recipesToShow.length > 0 ? (
                    <View style={styles.recipesContainer}>
                        {recipesToShow.map((recipe) => (
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
                                    <TouchableOpacity
                                        onPress={(event) => handleFavoritePress(recipe, event)}
                                    >
                                        <Ionicons 
                                            name={isFavorite(recipe._id) ? "heart" : "heart-outline"} 
                                            size={24} 
                                            color={isFavorite(recipe._id) ? "#FF6B6B" : "white"} 
                                        />
                                    </TouchableOpacity>
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
                        <Ionicons name="book-outline" size={48} color="#ccc" />
                        <Text style={styles.noResultsTitle}>No tienes recetas aún</Text>
                        <Text style={styles.noResultsText}>
                            ¡Crea tu primera receta y compártela con la comunidad!
                        </Text>
                    </View>
                )}
            </ScrollView>
            <BottomTabBar />
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
}); 