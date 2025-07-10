import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
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
import { CreateRecipeRequest, Ingredient } from '../types/Recipie';
import { RecipesService } from '../utils/recipesService';
import { useAlert } from '../utils/useAlert';
import { useAuthGuard } from '../utils/useAuthGuard';

const UNIDADES_MEDIDA = [
    'g', 'kg', 'ml', 'l', 'cdta', 'cda', 'taza', 'unidad', 'pizca'
];

const TAGS_SUGERIDOS = [
    'Vegetariano', 'Vegano', 'SinGluten', 'Dulce', 'Salado', 'Rapido', 
    'Internacional', 'Tradicional', 'Saludable', 'Economico'
];

const CATEGORIAS = [
    'desayuno', 'almuerzo', 'cena', 'postre', 'snack', 'aperitivo', 
    'bebida', 'salsa', 'sopa', 'ensalada', 'pan', 'otro'
];

const DIFICULTADES = [
    { value: 'facil', label: 'Fácil' },
    { value: 'medio', label: 'Medio' },
    { value: 'dificil', label: 'Difícil' }
];

export default function CrearRecetaScreen() {
    useAuthGuard();

    // Estados del formulario
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cantidadComensales, setCantidadComensales] = useState('');
    const [tiempoCoccion, setTiempoCoccion] = useState('');
    const [dificultad, setDificultad] = useState('');
    const [categoria, setCategoria] = useState('');
    const [cocina, setCocina] = useState('');
    const [imagen, setImagen] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [ingredientes, setIngredientes] = useState<Ingredient[]>([]);
    const [pasos, setPasos] = useState<string[]>(['']);
    
    // Estados para modales
    const [showTagsModal, setShowTagsModal] = useState(false);
    const [showIngredientModal, setShowIngredientModal] = useState(false);
    const [showUnidadModal, setShowUnidadModal] = useState(false);
    const [showDificultadModal, setShowDificultadModal] = useState(false);
    const [showCategoriaModal, setShowCategoriaModal] = useState(false);
    
    // Estados para nuevo ingrediente
    const [newIngredient, setNewIngredient] = useState('');
    const [newCantidad, setNewCantidad] = useState('');
    const [newUnidad, setNewUnidad] = useState<string>('');
    const [editingIngredientIndex, setEditingIngredientIndex] = useState<number | null>(null);
    
    // Estados de UI
    const [submitting, setSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    
    // Hook para alertas
    const { alertState, showError, showSuccess, hideAlert, handleConfirm, handleCancel } = useAlert();

    // Funciones para tags
    const toggleTag = (tag: string) => {
        setTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const removeTag = (tag: string) => {
        setTags(prev => prev.filter(t => t !== tag));
    };

    // Funciones para ingredientes
    const addIngredient = () => {
        if (!newIngredient.trim() || !newCantidad.trim() || !newUnidad.trim()) {
            showError('Completa todos los campos del ingrediente');
            return;
        }

        const ingredient: Ingredient = {
            ingrediente: newIngredient.trim(),
            cantidad: parseFloat(newCantidad),
            unidadMedida: newUnidad as 'g' | 'kg' | 'ml' | 'l' | 'cdta' | 'cda' | 'taza' | 'unidad' | 'pizca'
        };

        if (editingIngredientIndex !== null) {
            // Editar ingrediente existente
            setIngredientes(prev => 
                prev.map((ing, index) => 
                    index === editingIngredientIndex ? ingredient : ing
                )
            );
            setEditingIngredientIndex(null);
        } else {
            // Agregar nuevo ingrediente
            setIngredientes(prev => [...prev, ingredient]);
        }

        setNewIngredient('');
        setNewCantidad('');
        setNewUnidad('');
        setShowIngredientModal(false);
    };

    const editIngredient = (index: number) => {
        const ingredient = ingredientes[index];
        setNewIngredient(ingredient.ingrediente);
        setNewCantidad(ingredient.cantidad.toString());
        setNewUnidad(ingredient.unidadMedida);
        setEditingIngredientIndex(index);
        setShowIngredientModal(true);
    };

    const removeIngredient = (index: number) => {
        setIngredientes(prev => prev.filter((_, i) => i !== index));
    };

    // Funciones para pasos
    const updatePaso = (index: number, value: string) => {
        setPasos(prev => 
            prev.map((paso, i) => i === index ? value : paso)
        );
    };

    const addPaso = () => {
        setPasos(prev => [...prev, '']);
    };

    const removePaso = (index: number) => {
        if (pasos.length > 1) {
            setPasos(prev => prev.filter((_, i) => i !== index));
        }
    };

    // Validación
    const validateForm = (): boolean => {
        if (!titulo.trim()) {
            showError('El título es obligatorio');
            return false;
        }
        if (!descripcion.trim()) {
            showError('La descripción es obligatoria');
            return false;
        }
        if (!cantidadComensales || isNaN(parseInt(cantidadComensales))) {
            showError('La cantidad de comensales debe ser un número válido');
            return false;
        }
        if (!tiempoCoccion || isNaN(parseInt(tiempoCoccion))) {
            showError('El tiempo de cocción debe ser un número válido');
            return false;
        }
        if (!dificultad) {
            showError('Debe seleccionar la dificultad');
            return false;
        }
        if (!categoria) {
            showError('Debe seleccionar una categoría');
            return false;
        }
        if (!cocina.trim()) {
            showError('El tipo de cocina es obligatorio');
            return false;
        }
        if (ingredientes.length === 0) {
            showError('Debe agregar al menos un ingrediente');
            return false;
        }
        if (pasos.filter(p => p.trim()).length === 0) {
            showError('Debe agregar al menos un paso');
            return false;
        }
        return true;
    };

    // Enviar receta
    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            
            const recipeData: CreateRecipeRequest = {
                titulo: titulo.trim(),
                descripcion: descripcion.trim(),
                cantidadComensales: parseInt(cantidadComensales),
                tiempoCoccion: parseInt(tiempoCoccion),
                dificultad: dificultad as 'facil' | 'medio' | 'dificil',
                categoria: categoria as 'desayuno' | 'almuerzo' | 'cena' | 'postre' | 'snack' | 'aperitivo' | 'bebida' | 'salsa' | 'sopa' | 'ensalada' | 'pan' | 'otro',
                cocina: cocina.trim(),
                ingredientes: ingredientes,
                pasos: pasos.filter(p => p.trim()),
                tags: tags as ('Vegetariano' | 'Vegano' | 'SinGluten' | 'Dulce' | 'Salado' | 'Rapido' | 'Internacional' | 'Tradicional' | 'Saludable' | 'Economico')[],
                imagen: imagen.trim() || undefined
            };

            const response = await RecipesService.createRecipe(recipeData);

            if (response.success) {
                showSuccess(
                    'Tu receta ha sido enviada y será revisada por un administrador antes de ser publicada.',
                    () => router.push('/homeScreen')
                );
            } else {
                showError(response.error || 'Error al crear la receta');
            }
        } catch (error) {
            showError('Error de conexión');
        } finally {
            setSubmitting(false);
        }
    };

    const nextStep = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return renderBasicInfo();
            case 1:
                return renderIngredients();
            case 2:
                return renderSteps();
            default:
                return renderBasicInfo();
        }
    };

    const renderBasicInfo = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Información Básica</Text>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Título de la receta *</Text>
                <TextInput
                    style={styles.input}
                    value={titulo}
                    onChangeText={setTitulo}
                    placeholder="Ej: Pasta carbonara casera"
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Descripción *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={descripcion}
                    onChangeText={setDescripcion}
                    placeholder="Describe tu receta brevemente..."
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Cantidad de comensales *</Text>
                <TextInput
                    style={styles.input}
                    value={cantidadComensales}
                    onChangeText={setCantidadComensales}
                    placeholder="Ej: 4"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Tiempo de cocción (minutos) *</Text>
                <TextInput
                    style={styles.input}
                    value={tiempoCoccion}
                    onChangeText={setTiempoCoccion}
                    placeholder="Ej: 30"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Dificultad *</Text>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowDificultadModal(true)}
                >
                    <Text style={[styles.inputText, !dificultad && styles.placeholder]}>
                        {dificultad ? DIFICULTADES.find(d => d.value === dificultad)?.label : 'Seleccionar dificultad'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Categoría *</Text>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowCategoriaModal(true)}
                >
                    <Text style={[styles.inputText, !categoria && styles.placeholder]}>
                        {categoria || 'Seleccionar categoría'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Tipo de cocina *</Text>
                <TextInput
                    style={styles.input}
                    value={cocina}
                    onChangeText={setCocina}
                    placeholder="Ej: Italiana, Mexicana, Casera"
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>URL de imagen (opcional)</Text>
                <TextInput
                    style={styles.input}
                    value={imagen}
                    onChangeText={setImagen}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Tags</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowTagsModal(true)}
                >
                    <Ionicons name="add" size={20} color="#4C5F00" />
                    <Text style={styles.addButtonText}>Agregar Tags</Text>
                </TouchableOpacity>
                
                <View style={styles.tagsContainer}>
                    {tags.map(tag => (
                        <View key={tag} style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                            <TouchableOpacity onPress={() => removeTag(tag)}>
                                <Ionicons name="close" size={16} color="#4C5F00" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderIngredients = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Ingredientes</Text>
            
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowIngredientModal(true)}
            >
                <Ionicons name="add" size={20} color="#4C5F00" />
                <Text style={styles.addButtonText}>Agregar Ingrediente</Text>
            </TouchableOpacity>

            <FlatList
                data={ingredientes}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.ingredientCard}>
                        <View style={styles.ingredientInfo}>
                            <Text style={styles.ingredientName}>{item.ingrediente}</Text>
                            <Text style={styles.ingredientQuantity}>
                                {item.cantidad} {item.unidadMedida}
                            </Text>
                        </View>
                        <View style={styles.ingredientActions}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => editIngredient(index)}
                            >
                                <Ionicons name="create" size={16} color="#4C5F00" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => removeIngredient(index)}
                            >
                                <Ionicons name="trash" size={16} color="#D32F2F" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );

    const renderSteps = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Pasos de Preparación</Text>
            
            <FlatList
                data={pasos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.stepCard}>
                        <View style={styles.stepHeader}>
                            <Text style={styles.stepNumber}>Paso {index + 1}</Text>
                            {pasos.length > 1 && (
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => removePaso(index)}
                                >
                                    <Ionicons name="trash" size={16} color="#D32F2F" />
                                </TouchableOpacity>
                            )}
                        </View>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={item}
                            onChangeText={(value) => updatePaso(index, value)}
                            placeholder={`Describe el paso ${index + 1}...`}
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />
                    </View>
                )}
            />
            
            <TouchableOpacity
                style={styles.addButton}
                onPress={addPaso}
            >
                <Ionicons name="add" size={20} color="#4C5F00" />
                <Text style={styles.addButtonText}>Agregar Paso</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Header />
            
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Crear Nueva Receta</Text>
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View 
                                style={[
                                    styles.progressFill, 
                                    { width: `${((currentStep + 1) / 3) * 100}%` }
                                ]} 
                            />
                        </View>
                        <Text style={styles.progressText}>
                            Paso {currentStep + 1} de 3
                        </Text>
                    </View>
                </View>

                {renderStep()}

                <View style={styles.navigationButtons}>
                    {currentStep > 0 && (
                        <TouchableOpacity
                            style={[styles.navButton, styles.prevButton]}
                            onPress={prevStep}
                        >
                            <Ionicons name="chevron-back" size={20} color="#666" />
                            <Text style={styles.prevButtonText}>Anterior</Text>
                        </TouchableOpacity>
                    )}
                    
                    {currentStep < 2 ? (
                        <TouchableOpacity
                            style={[styles.navButton, styles.nextButton]}
                            onPress={nextStep}
                        >
                            <Text style={styles.nextButtonText}>Siguiente</Text>
                            <Ionicons name="chevron-forward" size={20} color="#fff" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.navButton, styles.submitButton, submitting && styles.submitButtonDisabled]}
                            onPress={handleSubmit}
                            disabled={submitting}
                        >
                            <Text style={styles.submitButtonText}>
                                {submitting ? 'Enviando...' : 'Crear Receta'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            <BottomTabBar />

            {/* Modal de Tags */}
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
                            data={TAGS_SUGERIDOS}
                            numColumns={2}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.tagOption,
                                        tags.includes(item) && styles.tagOptionSelected
                                    ]}
                                    onPress={() => toggleTag(item)}
                                >
                                    <Text style={[
                                        styles.tagOptionText,
                                        tags.includes(item) && styles.tagOptionTextSelected
                                    ]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* Modal de Ingredientes */}
            <Modal
                transparent
                visible={showIngredientModal}
                animationType="slide"
                onRequestClose={() => setShowIngredientModal(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {editingIngredientIndex !== null ? 'Editar' : 'Agregar'} Ingrediente
                            </Text>
                            <TouchableOpacity onPress={() => setShowIngredientModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Ingrediente</Text>
                            <TextInput
                                style={styles.input}
                                value={newIngredient}
                                onChangeText={setNewIngredient}
                                placeholder="Ej: Harina"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Cantidad</Text>
                            <TextInput
                                style={styles.input}
                                value={newCantidad}
                                onChangeText={setNewCantidad}
                                placeholder="Ej: 500"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Unidad de medida</Text>
                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowUnidadModal(true)}
                            >
                                <Text style={[styles.inputText, !newUnidad && styles.placeholder]}>
                                    {newUnidad || 'Seleccionar unidad'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.modalSubmitButton}
                            onPress={addIngredient}
                        >
                            <Text style={styles.modalSubmitText}>
                                {editingIngredientIndex !== null ? 'Actualizar' : 'Agregar'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de Unidades */}
            <Modal
                transparent
                visible={showUnidadModal}
                animationType="slide"
                onRequestClose={() => setShowUnidadModal(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar Unidad</Text>
                            <TouchableOpacity onPress={() => setShowUnidadModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        
                        <FlatList
                            data={UNIDADES_MEDIDA}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.unitOption}
                                    onPress={() => {
                                        setNewUnidad(item);
                                        setShowUnidadModal(false);
                                    }}
                                >
                                    <Text style={styles.unitOptionText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* Modal de Dificultad */}
            <Modal
                transparent
                visible={showDificultadModal}
                animationType="slide"
                onRequestClose={() => setShowDificultadModal(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar Dificultad</Text>
                            <TouchableOpacity onPress={() => setShowDificultadModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        
                        <FlatList
                            data={DIFICULTADES}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.unitOption}
                                    onPress={() => {
                                        setDificultad(item.value);
                                        setShowDificultadModal(false);
                                    }}
                                >
                                    <Text style={styles.unitOptionText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* Modal de Categoría */}
            <Modal
                transparent
                visible={showCategoriaModal}
                animationType="slide"
                onRequestClose={() => setShowCategoriaModal(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar Categoría</Text>
                            <TouchableOpacity onPress={() => setShowCategoriaModal(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        
                        <FlatList
                            data={CATEGORIAS}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.unitOption}
                                    onPress={() => {
                                        setCategoria(item);
                                        setShowCategoriaModal(false);
                                    }}
                                >
                                    <Text style={styles.unitOptionText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
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
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4C5F00',
        marginBottom: 16,
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4C5F00',
        borderRadius: 2,
    },
    progressText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    stepContainer: {
        marginBottom: 20,
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4C5F00',
        marginBottom: 20,
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
    inputText: {
        fontSize: 16,
        color: '#333',
    },
    placeholder: {
        color: '#999',
    },
    textArea: {
        minHeight: 80,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E8',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    addButtonText: {
        color: '#4C5F00',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#C4B04E',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    tagText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    ingredientCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    ingredientInfo: {
        flex: 1,
    },
    ingredientName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    ingredientQuantity: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    ingredientActions: {
        flexDirection: 'row',
        gap: 8,
    },
    editButton: {
        padding: 8,
    },
    deleteButton: {
        padding: 8,
    },
    stepCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    stepHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    stepNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4C5F00',
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 20,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 120,
        justifyContent: 'center',
    },
    prevButton: {
        backgroundColor: '#f0f0f0',
    },
    prevButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 4,
    },
    nextButton: {
        backgroundColor: '#4C5F00',
        marginLeft: 'auto',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 4,
    },
    submitButton: {
        backgroundColor: '#4C5F00',
        marginLeft: 'auto',
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
    modalSubmitButton: {
        backgroundColor: '#4C5F00',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    modalSubmitText: {
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
    unitOption: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    unitOptionText: {
        fontSize: 16,
        color: '#333',
    },
}); 