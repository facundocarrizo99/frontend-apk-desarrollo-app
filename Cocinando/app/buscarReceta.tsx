import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { AlertModal } from '../components/AlertModal';
import BottomTabBar from '../components/BottomTabBar';
import Header from '../components/Header';
import { Recipe } from '../types/Recipie';
import { RecipesService } from '../utils/recipesService';
import { useAlert } from '../utils/useAlert';
import { useAuthGuard } from '../utils/useAuthGuard';

const AVAILABLE_TAGS = [
    'Vegetariano', 'Vegano', 'SinGluten', 'Dulce', 'Salado', 
    'Rapido', 'Internacional', 'Tradicional', 'Saludable', 'Economico'
];

interface SearchFilters {
    includeIngredients: string[];
    excludeIngredients: string[];
    tags: string[];
}

export default function BuscarRecetasScreen() {
    // Proteger la ruta
    useAuthGuard();

    // Estados principales
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Estados para filtros
    const [filters, setFilters] = useState<SearchFilters>({
        includeIngredients: [],
        excludeIngredients: [],
        tags: []
    });

    // Estados para modales
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [showTagsModal, setShowTagsModal] = useState(false);
    const [showIncludeIngredientsModal, setShowIncludeIngredientsModal] = useState(false);
    const [showExcludeIngredientsModal, setShowExcludeIngredientsModal] = useState(false);

    // Estados para listas de autocomplete
    const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
    const [newIngredient, setNewIngredient] = useState('');

    // Hook para alertas
    const { alertState, showError, hideAlert, handleConfirm, handleCancel } = useAlert();

    // Cargar ingredientes disponibles al montar
    useEffect(() => {
        loadAvailableIngredients();
    }, []);

    const loadAvailableIngredients = async () => {
        try {
            const response = await RecipesService.getIngredientNames();
            if (response.success && response.names) {
                setAvailableIngredients(response.names);
            }
        } catch (error) {
            console.error('Error loading ingredients:', error);
        }
    };

    // Función de búsqueda principal
    const handleSearch = async () => {
        if (!searchText.trim() && filters.includeIngredients.length === 0 && filters.tags.length === 0) {
            showError('Ingresa un término de búsqueda o selecciona filtros');
            return;
        }

        setLoading(true);
        setHasSearched(true);

        try {
            let results: Recipe[] = [];

            // Obtener todas las recetas aprobadas primero
            const allRecipesResponse = await RecipesService.getApprovedRecipes();
            if (allRecipesResponse.success && allRecipesResponse.recipes) {
                results = allRecipesResponse.recipes.filter(r => r.aprobado === true);
            }

            // Si hay texto de búsqueda, filtrar por texto
            if (searchText.trim()) {
                results = RecipesService.searchRecipes(results, searchText);
            }

            // Aplicar filtros de ingredientes a incluir
            if (filters.includeIngredients.length > 0) {
                for (const ingredient of filters.includeIngredients) {
                    results = results.filter(recipe =>
                        recipe.ingredientes?.some(ing => ing.ingrediente?.toLowerCase() === ingredient.toLowerCase())
                    );
                }
            }

            // Aplicar filtros de ingredientes a excluir (arreglado)
            if (filters.excludeIngredients.length > 0) {
                for (const ingredient of filters.excludeIngredients) {
                    results = results.filter(recipe =>
                        !recipe.ingredientes?.some(ing => ing.ingrediente?.toLowerCase() === ingredient.toLowerCase())
                    );
                }
            }

            // Aplicar filtros de tags
            if (filters.tags.length > 0) {
                results = results.filter(recipe =>
                    filters.tags.every(tag => (recipe.tags ?? []).includes(tag))
                );
            }

            setSearchResults(results);
        } catch (error) {
            console.error('Error in search:', error);
            showError('Error al realizar la búsqueda');
        } finally {
            setLoading(false);
        }
    };

    // Limpiar búsqueda
    const clearSearch = () => {
        setSearchText('');
        setSearchResults([]);
        setHasSearched(false);
        setFilters({
            includeIngredients: [],
            excludeIngredients: [],
            tags: []
        });
    };

    // Gestión de filtros
    const toggleTag = (tag: string) => {
        setFilters(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const addIncludeIngredient = () => {
        if (newIngredient.trim() && !filters.includeIngredients.includes(newIngredient.trim())) {
            setFilters(prev => ({
                ...prev,
                includeIngredients: [...prev.includeIngredients, newIngredient.trim()]
            }));
            setNewIngredient('');
            setShowIncludeIngredientsModal(false);
        }
    };

    const addExcludeIngredient = () => {
        if (newIngredient.trim() && !filters.excludeIngredients.includes(newIngredient.trim())) {
            setFilters(prev => ({
                ...prev,
                excludeIngredients: [...prev.excludeIngredients, newIngredient.trim()]
            }));
            setNewIngredient('');
            setShowExcludeIngredientsModal(false);
        }
    };

    const removeIncludeIngredient = (ingredient: string) => {
        setFilters(prev => ({
            ...prev,
            includeIngredients: prev.includeIngredients.filter(i => i !== ingredient)
        }));
    };

    const removeExcludeIngredient = (ingredient: string) => {
        setFilters(prev => ({
            ...prev,
            excludeIngredients: prev.excludeIngredients.filter(i => i !== ingredient)
        }));
    };

    // Navegar al detalle de receta
    const handleRecipePress = (recipe: Recipe) => {
        router.push({
            pathname: '/recipeDetail',
            params: {
                id: recipe._id,
                titulo: recipe.titulo || '',
                descripcion: recipe.descripcion || '',
                imagen: recipe.imagen || '',
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

    // Funciones helper para datos de receta
    const getRecipeImage = (recipe: Recipe): string => {
        return recipe.imagen || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop';
    };

    const getAuthorName = (recipe: Recipe): string => {
        return recipe.autor?.name || 'Autor desconocido';
    };

    const getAuthorAvatar = (recipe: Recipe): string => {
        return recipe.autor?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg';
    };

    const getActiveFiltersCount = () => {
        return filters.includeIngredients.length + filters.excludeIngredients.length + filters.tags.length;
    };

    return (
        <View style={styles.container}>
            <Header />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Título */}
                <View style={styles.titleContainer}>
                    <Ionicons name="search" size={28} color="#4C5F00" />
                    <Text style={styles.sectionTitle}>Búsqueda Avanzada</Text>
                </View>

                {/* Barra de búsqueda */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Buscar por nombre, autor, descripción..."
                            style={styles.searchInput}
                            value={searchText}
                            onChangeText={setSearchText}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        {searchText.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
                                <Ionicons name="close-circle" size={20} color="#666" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Botones de filtros y búsqueda */}
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity 
                        style={[styles.filterButton, getActiveFiltersCount() > 0 && styles.filterButtonActive]} 
                        onPress={() => setShowFiltersModal(true)}
                    >
                        <Ionicons name="options" size={20} color={getActiveFiltersCount() > 0 ? "#fff" : "#4C5F00"} />
                        <Text style={[styles.filterButtonText, getActiveFiltersCount() > 0 && styles.filterButtonTextActive]}>
                            Filtros {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name="search" size={20} color="#fff" />
                        )}
                        <Text style={styles.searchButtonText}>
                            {loading ? 'Buscando...' : 'Buscar'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Filtros activos */}
                {getActiveFiltersCount() > 0 && (
                    <View style={styles.activeFiltersContainer}>
                        <View style={styles.activeFiltersHeader}>
                            <Text style={styles.activeFiltersTitle}>Filtros activos:</Text>
                            <TouchableOpacity onPress={clearSearch} style={styles.clearFiltersButton}>
                                <Text style={styles.clearFiltersText}>Limpiar todo</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.activeFiltersContent}>
                            {filters.includeIngredients.map(ingredient => (
                                <View key={`include-${ingredient}`} style={[styles.filterChip, styles.includeChip]}>
                                    <Text style={styles.filterChipText}>+{ingredient}</Text>
                                    <TouchableOpacity onPress={() => removeIncludeIngredient(ingredient)}>
                                        <Ionicons name="close" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {filters.excludeIngredients.map(ingredient => (
                                <View key={`exclude-${ingredient}`} style={[styles.filterChip, styles.excludeChip]}>
                                    <Text style={styles.filterChipText}>-{ingredient}</Text>
                                    <TouchableOpacity onPress={() => removeExcludeIngredient(ingredient)}>
                                        <Ionicons name="close" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            {filters.tags.map(tag => (
                                <View key={`tag-${tag}`} style={[styles.filterChip, styles.tagChip]}>
                                    <Text style={styles.filterChipText}>{tag}</Text>
                                    <TouchableOpacity onPress={() => toggleTag(tag)}>
                                        <Ionicons name="close" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Resultados */}
                {hasSearched && (
                    <View style={styles.resultsContainer}>
                        <Text style={styles.resultsTitle}>
                            {loading ? 'Buscando...' : `${searchResults.length} resultado${searchResults.length !== 1 ? 's' : ''} encontrado${searchResults.length !== 1 ? 's' : ''}`}
                        </Text>

                        {searchResults.length > 0 ? (
                            <View style={styles.recipesContainer}>
                                {searchResults.map((recipe) => (
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
                                            <View style={styles.recipeFooter}>
                                                <View style={styles.recipeInfo}>
                                                    <Text style={styles.recipeTitle}>{recipe.titulo}</Text>
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
                        ) : !loading && (
                            <View style={styles.noResultsContainer}>
                                <Ionicons name="search" size={64} color="#ccc" />
                                <Text style={styles.noResultsTitle}>No se encontraron recetas</Text>
                                <Text style={styles.noResultsText}>
                                    Intenta ajustar tus criterios de búsqueda o filtros
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            <BottomTabBar />

            {/* Modal principal de filtros */}
            <Modal
                transparent
                visible={showFiltersModal}
                animationType="slide"
                onRequestClose={() => setShowFiltersModal(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filtros de Búsqueda</Text>
                            <TouchableOpacity onPress={() => setShowFiltersModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Ingredientes a incluir */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Debe contener ingredientes:</Text>
                                <TouchableOpacity 
                                    style={styles.addFilterButton}
                                    onPress={() => {
                                        setNewIngredient('');
                                        setShowIncludeIngredientsModal(true);
                                    }}
                                >
                                    <Ionicons name="add" size={20} color="#4C5F00" />
                                    <Text style={styles.addFilterButtonText}>Agregar ingrediente</Text>
                                </TouchableOpacity>
                                
                                <View style={styles.filterChipsContainer}>
                                    {filters.includeIngredients.map(ingredient => (
                                        <View key={ingredient} style={[styles.filterChip, styles.includeChip]}>
                                            <Text style={styles.filterChipText}>+{ingredient}</Text>
                                            <TouchableOpacity onPress={() => removeIncludeIngredient(ingredient)}>
                                                <Ionicons name="close" size={16} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Ingredientes a excluir */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>NO debe contener ingredientes:</Text>
                                <TouchableOpacity 
                                    style={styles.addFilterButton}
                                    onPress={() => {
                                        setNewIngredient('');
                                        setShowExcludeIngredientsModal(true);
                                    }}
                                >
                                    <Ionicons name="add" size={20} color="#D32F2F" />
                                    <Text style={[styles.addFilterButtonText, { color: '#D32F2F' }]}>Excluir ingrediente</Text>
                                </TouchableOpacity>
                                
                                <View style={styles.filterChipsContainer}>
                                    {filters.excludeIngredients.map(ingredient => (
                                        <View key={ingredient} style={[styles.filterChip, styles.excludeChip]}>
                                            <Text style={styles.filterChipText}>-{ingredient}</Text>
                                            <TouchableOpacity onPress={() => removeExcludeIngredient(ingredient)}>
                                                <Ionicons name="close" size={16} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Tags */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Tags:</Text>
                                <TouchableOpacity 
                                    style={styles.addFilterButton}
                                    onPress={() => setShowTagsModal(true)}
                                >
                                    <Ionicons name="add" size={20} color="#C4B04E" />
                                    <Text style={[styles.addFilterButtonText, { color: '#C4B04E' }]}>Seleccionar tags</Text>
                                </TouchableOpacity>
                                
                                <View style={styles.filterChipsContainer}>
                                    {filters.tags.map(tag => (
                                        <View key={tag} style={[styles.filterChip, styles.tagChip]}>
                                            <Text style={styles.filterChipText}>{tag}</Text>
                                            <TouchableOpacity onPress={() => toggleTag(tag)}>
                                                <Ionicons name="close" size={16} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.modalApplyButton}
                            onPress={() => setShowFiltersModal(false)}
                        >
                            <Text style={styles.modalApplyText}>Aplicar Filtros</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de tags */}
            <Modal
                transparent
                visible={showTagsModal}
                animationType="slide"
                onRequestClose={() => setShowTagsModal(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar Tags</Text>
                            <TouchableOpacity onPress={() => setShowTagsModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        
                        <FlatList
                            data={AVAILABLE_TAGS}
                            numColumns={2}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.tagOption,
                                        filters.tags.includes(item) && styles.tagOptionSelected
                                    ]}
                                    onPress={() => toggleTag(item)}
                                >
                                    <Text style={[
                                        styles.tagOptionText,
                                        filters.tags.includes(item) && styles.tagOptionTextSelected
                                    ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            style={styles.modalApplyButton}
                            onPress={() => setShowTagsModal(false)}
                        >
                            <Text style={styles.modalApplyText}>Listo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal para agregar ingredientes a incluir */}
            <Modal
                transparent
                visible={showIncludeIngredientsModal}
                animationType="slide"
                onRequestClose={() => setShowIncludeIngredientsModal(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Agregar Ingrediente</Text>
                            <TouchableOpacity onPress={() => setShowIncludeIngredientsModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nombre del ingrediente:</Text>
                            <TextInput
                                style={styles.input}
                                value={newIngredient}
                                onChangeText={setNewIngredient}
                                placeholder="Ej: Pollo, Pasta, Tomate..."
                                placeholderTextColor="#999"
                                onSubmitEditing={addIncludeIngredient}
                                returnKeyType="done"
                            />
                        </View>

                        {availableIngredients.length > 0 && (
                            <View>
                                <Text style={styles.suggestionsTitle}>Sugerencias:</Text>
                                <FlatList
                                    data={availableIngredients.filter(ing => 
                                        ing.toLowerCase().includes(newIngredient.toLowerCase()) &&
                                        !filters.includeIngredients.includes(ing)
                                    ).slice(0, 10)}
                                    keyExtractor={(item) => item}
                                    style={styles.suggestionsList}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.suggestionItem}
                                            onPress={() => {
                                                setNewIngredient(item);
                                                addIncludeIngredient();
                                            }}
                                        >
                                            <Text style={styles.suggestionText}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.modalApplyButton}
                            onPress={addIncludeIngredient}
                        >
                            <Text style={styles.modalApplyText}>Agregar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal para agregar ingredientes a excluir */}
            <Modal
                transparent
                visible={showExcludeIngredientsModal}
                animationType="slide"
                onRequestClose={() => setShowExcludeIngredientsModal(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Excluir Ingrediente</Text>
                            <TouchableOpacity onPress={() => setShowExcludeIngredientsModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Ingrediente a excluir:</Text>
                            <TextInput
                                style={styles.input}
                                value={newIngredient}
                                onChangeText={setNewIngredient}
                                placeholder="Ej: Gluten, Lácteos, Maní..."
                                placeholderTextColor="#999"
                                onSubmitEditing={addExcludeIngredient}
                                returnKeyType="done"
                            />
                        </View>

                        {availableIngredients.length > 0 && (
                            <View>
                                <Text style={styles.suggestionsTitle}>Sugerencias:</Text>
                                <FlatList
                                    data={availableIngredients.filter(ing => 
                                        ing.toLowerCase().includes(newIngredient.toLowerCase()) &&
                                        !filters.excludeIngredients.includes(ing)
                                    ).slice(0, 10)}
                                    keyExtractor={(item) => item}
                                    style={styles.suggestionsList}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.suggestionItem}
                                            onPress={() => {
                                                setNewIngredient(item);
                                                addExcludeIngredient();
                                            }}
                                        >
                                            <Text style={styles.suggestionText}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )}

                        <TouchableOpacity
                            style={[styles.modalApplyButton, { backgroundColor: '#D32F2F' }]}
                            onPress={addExcludeIngredient}
                        >
                            <Text style={styles.modalApplyText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4C5F00',
    },
    searchContainer: {
        marginBottom: 15,
    },
    searchBar: {
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
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    filterButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8F5E8',
        paddingVertical: 12,
        borderRadius: 25,
        gap: 8,
    },
    filterButtonActive: {
        backgroundColor: '#4C5F00',
    },
    filterButtonText: {
        color: '#4C5F00',
        fontWeight: '600',
        fontSize: 14,
    },
    filterButtonTextActive: {
        color: '#fff',
    },
    searchButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4C5F00',
        paddingVertical: 12,
        borderRadius: 25,
        gap: 8,
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    activeFiltersContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
    },
    activeFiltersHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    activeFiltersTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    clearFiltersButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 15,
    },
    clearFiltersText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    activeFiltersContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    includeChip: {
        backgroundColor: '#4C5F00',
    },
    excludeChip: {
        backgroundColor: '#D32F2F',
    },
    tagChip: {
        backgroundColor: '#C4B04E',
    },
    filterChipText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    resultsContainer: {
        marginTop: 20,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4C5F00',
        marginBottom: 15,
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
    },
    // Estilos para modales
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        margin: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    filterSection: {
        marginBottom: 25,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    addFilterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 10,
        gap: 4,
    },
    addFilterButtonText: {
        color: '#4C5F00',
        fontSize: 14,
        fontWeight: '500',
    },
    filterChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    modalApplyButton: {
        backgroundColor: '#4C5F00',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    modalApplyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    tagOption: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        margin: 4,
        flex: 1,
        alignItems: 'center',
    },
    tagOptionSelected: {
        backgroundColor: '#4C5F00',
    },
    tagOptionText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '500',
    },
    tagOptionTextSelected: {
        color: '#fff',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    suggestionsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    suggestionsList: {
        maxHeight: 150,
        marginBottom: 15,
    },
    suggestionItem: {
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 6,
        marginBottom: 4,
    },
    suggestionText: {
        fontSize: 14,
        color: '#333',
    },
}); 