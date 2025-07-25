import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useMemo } from 'react';
import {
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
import RecipeHeader from '../components/RecipeHeader';
import IngredientsList from '../components/IngredientsList';
import StepsList from '../components/StepsList';
import CommentsSection from '../components/CommentsSection';
import AddCommentModal from '../components/AddCommentModal';
import { Comment, Recipe } from '../types/Recipie';
import { CommentsService } from '../utils/commentsService';
import { useAlert } from '../utils/useAlert';
import { UserManager } from '../utils/userManager';

export default function RecipeDetail() {
    // Obtener los parámetros de la receta
    const params = useLocalSearchParams();
    
    // Reconstruir el objeto recipe desde los parámetros
    const recipe: Recipe = {
        _id: params.id as string,
        titulo: params.titulo as string,
        descripcion: params.descripcion as string,
        imagen: params.imagen as string,
        autor: JSON.parse(params.autor as string),
        ingredientes: params.ingredientes ? JSON.parse(params.ingredientes as string) : [],
        pasos: params.pasos ? JSON.parse(params.pasos as string) : [],
        cantidadComensales: params.cantidadComensales ? parseInt(params.cantidadComensales as string) : 1,
        tags: params.tags ? JSON.parse(params.tags as string) : [],
        aprobado: true,
        valoracionPromedio: params.valoracionPromedio ? parseFloat(params.valoracionPromedio as string) : 0,
        fechaCreacion: params.fechaCreacion as string,
        fechaModificacion: params.fechaModificacion as string,
    };

    // Estados para comentarios
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [showAddCommentModal, setShowAddCommentModal] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    // Estados para la calculadora de comensales
    const baseComensales = typeof recipe.cantidadComensales === 'number' && !isNaN(recipe.cantidadComensales) ? recipe.cantidadComensales : 1;
    const [selectedComensales, setSelectedComensales] = useState(baseComensales);

    // Calcular ingredientes ajustados (memoized)
    const adjustedIngredients = useMemo(() => {
        if (!recipe.ingredientes) return [];
        return recipe.ingredientes.map(ing => ({
            ...ing,
            cantidad: Math.round((ing.cantidad * selectedComensales / baseComensales) * 100) / 100
        }));
    }, [recipe.ingredientes, selectedComensales, baseComensales]);
    
    // Hook para alertas
    const { alertState, showError, showSuccess, hideAlert, handleConfirm, handleCancel } = useAlert();

    // Verificar si el usuario está logueado
    useEffect(() => {
        const checkAuth = () => {
            const token = UserManager.getAuthToken();
            setIsLoggedIn(!!token);
        };
        checkAuth();
    }, []);

    // Cargar comentarios de la receta
    useEffect(() => {
        if (recipe._id) {
            loadComments();
        }
    }, [recipe._id]);

    const loadComments = async () => {
        try {
            setLoadingComments(true);
            const response = await CommentsService.getCommentsByRecipe(recipe._id);
            if (response.success) {
                setComments(response.comments || []);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    // Función para obtener el avatar del autor con fallback
    const getAuthorAvatar = (): string => {
        return recipe.autor?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg';
    };

    // Función para obtener el nombre del autor con fallback
    const getAuthorName = (): string => {
        return recipe.autor?.name || 'Autor desconocido';
    };

    // Función para renderizar estrellas (moved to StarRating component)

    // Función para enviar comentario
    const handleSubmitComment = async () => {
        if (!newComment.trim()) {
            showError('Por favor ingresa un comentario');
            return;
        }

        try {
            setSubmittingComment(true);
            const response = await CommentsService.createComment({
                texto: newComment.trim(),
                valoracion: newRating,
                receta: recipe._id
            });

            if (response.success) {
                setNewComment('');
                setNewRating(5);
                setShowAddCommentModal(false);
                showSuccess('Comentario enviado. Será revisado por un administrador antes de ser publicado.');
            } else {
                showError(response.error || 'Error al enviar comentario');
            }
        } catch (error) {
            showError('Error de conexión');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleAddComment = () => {
        if (!isLoggedIn) {
            showError('Debes iniciar sesión para comentar');
            return;
        }
        setShowAddCommentModal(true);
    };

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Imagen principal de la receta */}
                <RecipeHeader
                    image={recipe.imagen}
                    onBack={handleBack}
                    onEdit={() => {
                        router.push({
                            pathname: '/modificarReceta',
                            params: {
                                id: recipe._id,
                                titulo: recipe.titulo,
                                descripcion: recipe.descripcion,
                                imagen: recipe.imagen,
                                autor: JSON.stringify(recipe.autor),
                                ingredientes: JSON.stringify(recipe.ingredientes),
                                pasos: JSON.stringify(recipe.pasos),
                                cantidadComensales: recipe.cantidadComensales?.toString() || '1',
                                tags: JSON.stringify(recipe.tags),
                                valoracionPromedio: recipe.valoracionPromedio?.toString() || '0',
                                fechaCreacion: recipe.fechaCreacion || '',
                                fechaModificacion: recipe.fechaModificacion || '',
                                dificultad: (recipe as any).dificultad || '',
                                categoria: (recipe as any).categoria || '',
                                cocina: (recipe as any).cocina || '',
                            },
                        });
                    }}
                />
                {/* Información principal */}
                <View style={styles.mainInfo}>
                    <Text style={styles.recipeTitle}>{recipe.titulo}</Text>
                    {/* Información del autor */}
                    <View style={styles.authorSection}>
                        <Image 
                            source={{ uri: getAuthorAvatar() }} 
                            style={styles.authorAvatar} 
                        />
                        <View style={styles.authorDetails}>
                            <Text style={styles.authorLabel}>Creado por</Text>
                            <Text style={styles.authorName}>{getAuthorName()}</Text>
                        </View>
                    </View>
                    {/* Estadísticas */}
                    <View style={styles.statsContainer}>
                        {recipe.cantidadComensales && (
                            <View style={styles.statItem}>
                                <Ionicons name="people" size={20} color="#4C5F00" />
                                <Text style={styles.statText}>{recipe.cantidadComensales} comensales</Text>
                            </View>
                        )}
                        {recipe.valoracionPromedio && recipe.valoracionPromedio > 0 && (
                            <View style={styles.statItem}>
                                <Ionicons name="star" size={20} color="#FFD700" />
                                <Text style={styles.statText}>{recipe.valoracionPromedio.toFixed(1)}</Text>
                            </View>
                        )}
                    </View>
                    {/* Descripción */}
                    {recipe.descripcion && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Descripción</Text>
                            <Text style={styles.description}>{recipe.descripcion}</Text>
                        </View>
                    )}
                    {/* Tags */}
                    {recipe.tags && recipe.tags.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Etiquetas</Text>
                            <View style={styles.tagsContainer}>
                                {recipe.tags.map((tag, index) => (
                                    <View key={index} style={styles.tag}>
                                        <Text style={styles.tagText}>{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                    {/* Ingredientes */}
                    {recipe.ingredientes && recipe.ingredientes.length > 0 && (
                        <IngredientsList
                            ingredients={recipe.ingredientes}
                            selectedComensales={selectedComensales}
                            setSelectedComensales={setSelectedComensales}
                            baseComensales={baseComensales}
                        />
                    )}
                    {/* Pasos */}
                    {recipe.pasos && recipe.pasos.length > 0 && (
                        <StepsList steps={recipe.pasos} />
                    )}
                    {/* Comentarios */}
                    <CommentsSection
                        comments={comments}
                        loading={loadingComments}
                        onAddComment={handleAddComment}
                    />
                </View>
            </ScrollView>
            <BottomTabBar />
            {/* Modal para agregar comentario */}
            <AddCommentModal
                visible={showAddCommentModal}
                onClose={() => setShowAddCommentModal(false)}
                onSubmit={handleSubmitComment}
                newComment={newComment}
                setNewComment={setNewComment}
                newRating={newRating}
                setNewRating={setNewRating}
                submittingComment={submittingComment}
            />
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
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
    },
    imageContainer: {
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: 300,
        justifyContent: 'flex-start',
    },
    heroImageStyle: {
        resizeMode: 'cover',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingTop: 20,
        paddingHorizontal: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        position: 'absolute',
        top: 20,
        right: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    mainInfo: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    recipeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        lineHeight: 34,
    },
    authorSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    authorAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    authorDetails: {
        flex: 1,
    },
    authorLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 12,
        marginBottom: 8,
    },
    statText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4C5F00',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 14,
        color: '#4C5F00',
        fontWeight: '500',
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    ingredientBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4C5F00',
        marginTop: 8,
        marginRight: 12,
    },
    ingredientText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 22,
        color: '#555',
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#4C5F00',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    stepNumberText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    stepText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
    },
    // Estilos para comentarios
    commentsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    addCommentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addCommentText: {
        color: '#4C5F00',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        color: '#666',
        fontSize: 14,
    },
    emptyCommentsContainer: {
        alignItems: 'center',
        padding: 40,
    },
    emptyCommentsText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
        fontWeight: '600',
    },
    emptyCommentsSubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
    },
    commentsContainer: {
        gap: 16,
    },
    commentCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    commentInfo: {
        flex: 1,
    },
    commentAuthor: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    commentRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    interactiveStar: {
        padding: 4,
    },
    commentText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
        marginBottom: 8,
    },
    commentDate: {
        fontSize: 12,
        color: '#999',
    },
    // Estilos para modal
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        margin: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        minHeight: 100,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    modalCancelButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalCancelText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    modalSubmitButton: {
        flex: 1,
        backgroundColor: '#4C5F00',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalSubmitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    modalSubmitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    // Estilos para la calculadora de comensales
    peopleSelectorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 10,
    },
    peopleSelectorLabel: {
        fontSize: 15,
        color: '#4C5F00',
        fontWeight: 'bold',
        marginRight: 10,
    },
    peopleSelectorStepper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0E0',
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        gap: 8,
    },
    peopleSelectorButton: {
        padding: 4,
    },
    peopleSelectorValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4C5F00',
        minWidth: 28,
        textAlign: 'center',
    },
}); 