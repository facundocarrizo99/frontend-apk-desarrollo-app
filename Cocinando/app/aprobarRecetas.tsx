import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import Header from '../components/Header';
import { Recipe } from '../types/Recipie';
import { PendingRecipesService } from '../utils/pendingRecipesServices';
import { useAuthGuard } from '../utils/useAuthGuard';
import { router } from 'expo-router';


export default function AprobarRecetasScreen() {
   // Proteger la ruta
   useAuthGuard();
  
   const [recetas, setRecetas] = useState<Recipe[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string>('');
   const [confirmVisible, setConfirmVisible] = useState(false);
   const [successVisible, setSuccessVisible] = useState(false);
   const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
   const [selectedRecipe, setSelectedRecipe] = useState<{id: string, title: string} | null>(null);
   const [successMessage, setSuccessMessage] = useState('');
   const [actionLoading, setActionLoading] = useState(false);
   const [selectedRecipeForModal, setSelectedRecipeForModal] = useState<Recipe | null>(null);
   const [modalVisible, setModalVisible] = useState(false);


   // Cargar recetas pendientes al montar el componente
   useEffect(() => {
       loadPendingRecipes();
   }, []);


   const loadPendingRecipes = async () => {
       setLoading(true);
       setError('');
      
       try {
           const result = await PendingRecipesService.getPendingRecipes();
          
           if (result.success && result.recipes) {
               setRecetas(result.recipes);
           } else {
               setError(result.error || 'Error al cargar recetas pendientes');
               // Usar recetas de fallback en caso de error
               const fallbackRecipes = PendingRecipesService.getFallbackRecipes();
               setRecetas(fallbackRecipes);
           }
       } catch (err) {
           console.error('Error al cargar recetas pendientes:', err);
           setError('Error de conexión');
           // Usar recetas de fallback en caso de error
           const fallbackRecipes = PendingRecipesService.getFallbackRecipes();
           setRecetas(fallbackRecipes);
       } finally {
           setLoading(false);
       }
   };


   const handleApprove = (recipeId: string, recipeTitle: string) => {
       setSelectedRecipe({id: recipeId, title: recipeTitle});
       setConfirmAction('approve');
       setConfirmVisible(true);
   };


   const handleReject = (recipeId: string, recipeTitle: string) => {
       setSelectedRecipe({id: recipeId, title: recipeTitle});
       setConfirmAction('reject');
       setConfirmVisible(true);
   };


   const executeAction = async () => {
       if (!selectedRecipe || !confirmAction) return;
      
       setActionLoading(true);
      
       try {
           let result;
          
           if (confirmAction === 'approve') {
               result = await PendingRecipesService.approveRecipe(selectedRecipe.id);
           } else {
               result = await PendingRecipesService.rejectRecipe(selectedRecipe.id);
           }
          
           if (result.success) {
               // Remover la receta de la lista local
               setRecetas(prev => prev.filter(recipe => recipe._id !== selectedRecipe.id));
               setConfirmVisible(false);
              
               if (confirmAction === 'approve') {
                   setSuccessMessage(`La receta "${selectedRecipe.title}" ha sido aprobada.`);
               } else {
                   setSuccessMessage(`La receta "${selectedRecipe.title}" ha sido rechazada.`);
               }
              
               setSuccessVisible(true);
           } else {
               setError(result.error || 'Error al procesar la acción');
               setConfirmVisible(false);
           }
       } catch (err) {
           console.error('Error al ejecutar acción:', err);
           setError('Error de conexión al procesar la acción');
           setConfirmVisible(false);
       } finally {
           setActionLoading(false);
           setSelectedRecipe(null);
           setConfirmAction(null);
       }
   };


   const cancelAction = () => {
       setConfirmVisible(false);
       setSelectedRecipe(null);
       setConfirmAction(null);
   };


   // Función para obtener el avatar del autor con fallback
   const getAuthorAvatar = (recipe: Recipe): string => {
       return recipe.autor.avatar || recipe.author?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg';
   };


   // Función para obtener el título de la receta
   const getRecipeTitle = (recipe: Recipe): string => {
       return recipe.titulo || recipe.title || 'Sin título';
   };


   // Función para obtener la imagen de la receta
   const getRecipeImage = (recipe: Recipe): string => {
       return recipe.imagen || recipe.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
   };


   // Función para obtener el nombre del autor
   const getAuthorName = (recipe: Recipe): string => {
       return recipe.autor.name || recipe.author?.name || 'Autor desconocido';
   };


   // Función para formatear la fecha
   const formatDate = (dateString: string): string => {
       try {
           return new Date(dateString).toLocaleDateString('es-ES');
       } catch {
           return 'Fecha no disponible';
       }
   };


   // Función para navegar al detalle de la receta
   const handleRecipePress = (recipe: Recipe) => {
       setSelectedRecipeForModal(recipe);
       setModalVisible(true);
   };

   // Función para aprobar desde el modal
   const handleApproveFromModal = async () => {
       if (!selectedRecipeForModal) return;
       setActionLoading(true);
       try {
           const result = await PendingRecipesService.approveRecipe(selectedRecipeForModal._id);
           if (result.success) {
               setRecetas(prev => prev.filter(r => r._id !== selectedRecipeForModal._id));
               setSuccessMessage(`La receta "${getRecipeTitle(selectedRecipeForModal)}" ha sido aprobada.`);
               setSuccessVisible(true);
               setModalVisible(false);
           } else {
               setError(result.error || 'Error al aprobar la receta');
               setModalVisible(false);
           }
       } catch (err) {
           setError('Error de conexión al aprobar la receta');
           setModalVisible(false);
       } finally {
           setActionLoading(false);
           setSelectedRecipeForModal(null);
       }
   };

   // Función para rechazar desde el modal
   const handleRejectFromModal = async () => {
       if (!selectedRecipeForModal) return;
       setActionLoading(true);
       try {
           const result = await PendingRecipesService.rejectRecipe(selectedRecipeForModal._id);
           if (result.success) {
               setRecetas(prev => prev.filter(r => r._id !== selectedRecipeForModal._id));
               setSuccessMessage(`La receta "${getRecipeTitle(selectedRecipeForModal)}" ha sido rechazada.`);
               setSuccessVisible(true);
               setModalVisible(false);
           } else {
               setError(result.error || 'Error al rechazar la receta');
               setModalVisible(false);
           }
       } catch (err) {
           setError('Error de conexión al rechazar la receta');
           setModalVisible(false);
       } finally {
           setActionLoading(false);
           setSelectedRecipeForModal(null);
       }
   };

   // Función para cerrar el modal
   const handleCloseModal = () => {
       setModalVisible(false);
       setSelectedRecipeForModal(null);
   };


   if (loading) {
       return (
           <View style={styles.container}>
               <Header />
               <View style={styles.loadingContainer}>
                   <ActivityIndicator size="large" color="#4C5F00" />
                   <Text style={styles.loadingText}>Cargando recetas pendientes...</Text>
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
                       <TouchableOpacity onPress={loadPendingRecipes} style={styles.retryButton}>
                           <Text style={styles.retryText}>Reintentar</Text>
                       </TouchableOpacity>
                   </View>
               )}


               {/* Título de aprobar recetas */}
               <View style={styles.titleContainer}>
                   <Ionicons name="checkmark-circle-outline" size={28} color="#4C5F00" />
                   <Text style={styles.sectionTitle}>Aprobar Recetas</Text>
               </View>


               {recetas.length === 0 ? (
                   <View style={styles.emptyContainer}>
                       <Ionicons name="checkmark-done-circle" size={64} color="#C4B04E" />
                       <Text style={styles.emptyTitle}>¡Todo al día!</Text>
                       <Text style={styles.emptyText}>No hay recetas pendientes de aprobación</Text>
                   </View>
               ) : (
                   <View style={styles.recipesContainer}>
                       {recetas.map((recipe) => (
                           <TouchableOpacity key={recipe._id} style={styles.recipeCard} onPress={() => handleRecipePress(recipe)}>
                               <ImageBackground
                                   source={{ uri: getRecipeImage(recipe) }}
                                   style={styles.recipeBackground}
                                   imageStyle={styles.recipeBackgroundImage}
                               >
                                   {/* Header de la receta con autor y botones de acción */}
                                   <View style={styles.recipeHeader}>
                                       <View style={styles.authorInfo}>
                                           <Image source={{ uri: getAuthorAvatar(recipe) }} style={styles.authorAvatar} />
                                           <Text style={styles.authorName}>{getAuthorName(recipe)}</Text>
                                       </View>
                                      
                                       {/* Botones de aprobar y rechazar */}
                                       <View style={styles.actionButtons}>
                                           <TouchableOpacity
                                               style={styles.approveButton}
                                               onPress={() => handleApprove(recipe._id, getRecipeTitle(recipe))}
                                           >
                                               <Ionicons name="checkmark" size={20} color="#fff" />
                                           </TouchableOpacity>
                                           <TouchableOpacity
                                               style={styles.rejectButton}
                                               onPress={() => handleReject(recipe._id, getRecipeTitle(recipe))}
                                           >
                                               <Ionicons name="close" size={20} color="#fff" />
                                           </TouchableOpacity>
                                       </View>
                                   </View>


                                   {/* Footer con nombre de la receta */}
                                   <View style={styles.recipeFooter}>
                                       <Text style={styles.recipeTitle}>{getRecipeTitle(recipe)}</Text>
                                       <Text style={styles.submittedDate}>
                                           Enviada: {formatDate(recipe.fechaCreacion || recipe.createdAt || '')}
                                       </Text>
                                   </View>
                               </ImageBackground>
                           </TouchableOpacity>
                       ))}
                   </View>
               )}
           </ScrollView>


           <BottomTabBar />


           {/* Modal de confirmación */}
           <Modal
               transparent
               visible={confirmVisible}
               animationType="fade"
               onRequestClose={cancelAction}
           >
               <View style={styles.modalBackground}>
                   <View style={styles.modalBox}>
                       <Text style={styles.modalIcon}>
                           {confirmAction === 'approve' ? '✅' : '❌'}
                       </Text>
                       <Text style={styles.modalTitle}>
                           {confirmAction === 'approve' ? 'Aprobar Receta' : 'Rechazar Receta'}
                       </Text>
                       <Text style={styles.modalText}>
                           {confirmAction === 'approve'
                               ? `¿Estás seguro de que quieres aprobar "${selectedRecipe?.title}"?`
                               : `¿Estás seguro de que quieres rechazar "${selectedRecipe?.title}"?`
                           }
                       </Text>
                       <View style={styles.buttonContainer}>
                           <TouchableOpacity
                               style={[styles.modalButton, styles.cancelButton]}
                               onPress={cancelAction}
                               disabled={actionLoading}
                           >
                               <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancelar</Text>
                           </TouchableOpacity>
                           <TouchableOpacity
                               style={[styles.modalButton, confirmAction === 'approve' ? styles.approveModalButton : styles.rejectModalButton]}
                               onPress={executeAction}
                               disabled={actionLoading}
                           >
                               {actionLoading ? (
                                   <ActivityIndicator size="small" color="#fff" />
                               ) : (
                                   <Text style={styles.modalButtonText}>
                                       {confirmAction === 'approve' ? 'Aprobar' : 'Rechazar'}
                                   </Text>
                               )}
                           </TouchableOpacity>
                       </View>
                   </View>
               </View>
           </Modal>


           {/* Modal de éxito */}
           <Modal
               transparent
               visible={successVisible}
               animationType="fade"
               onRequestClose={() => setSuccessVisible(false)}
           >
               <View style={styles.modalBackground}>
                   <View style={styles.modalBox}>
                       <Text style={styles.modalIcon}>✅</Text>
                       <Text style={styles.modalTitle}>Acción Completada</Text>
                       <Text style={styles.modalText}>{successMessage}</Text>
                       <TouchableOpacity
                           style={styles.modalButton}
                           onPress={() => setSuccessVisible(false)}
                       >
                           <Text style={styles.modalButtonText}>Entendido</Text>
                       </TouchableOpacity>
                   </View>
               </View>
           </Modal>

           {/* Modal de detalle de receta para aprobar/rechazar */}
           <Modal
               transparent
               visible={modalVisible}
               animationType="slide"
               onRequestClose={handleCloseModal}
           >
               <View style={styles.modalBackground}>
                   <View style={[styles.modalBox, { width: '95%', maxHeight: '90%' }]}> 
                       <Text style={[styles.modalTitle, { alignSelf: 'center', width: '100%' }]}>Detalle de la Receta</Text>
                       {selectedRecipeForModal && (
                           <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                               {/* Imagen principal */}
                               <ImageBackground
                                   source={{ uri: getRecipeImage(selectedRecipeForModal) }}
                                   style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 12, overflow: 'hidden' }}
                                   imageStyle={{ borderRadius: 12 }}
                               />
                               {/* Título */}
                               <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8 }}>{getRecipeTitle(selectedRecipeForModal)}</Text>
                               {/* Autor y fecha */}
                               <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                   <Image source={{ uri: getAuthorAvatar(selectedRecipeForModal) }} style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }} />
                                   <Text style={{ fontSize: 14, color: '#333', fontWeight: '600' }}>{getAuthorName(selectedRecipeForModal)}</Text>
                                   <Text style={{ fontSize: 12, color: '#888', marginLeft: 10 }}>
                                       {formatDate(selectedRecipeForModal.fechaCreacion || selectedRecipeForModal.createdAt || '')}
                                   </Text>
                               </View>
                               {/* Estadísticas */}
                               <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
                                   {selectedRecipeForModal.cantidadComensales && (
                                       <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                                           <Ionicons name="people" size={16} color="#4C5F00" />
                                           <Text style={{ marginLeft: 4, fontSize: 13, color: '#666' }}>{selectedRecipeForModal.cantidadComensales} comensales</Text>
                                       </View>
                                   )}
                                   {selectedRecipeForModal.valoracionPromedio && selectedRecipeForModal.valoracionPromedio > 0 && (
                                       <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f9fa', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                                           <Ionicons name="star" size={16} color="#FFD700" />
                                           <Text style={{ marginLeft: 4, fontSize: 13, color: '#666' }}>{selectedRecipeForModal.valoracionPromedio.toFixed(1)}</Text>
                                       </View>
                                   )}
                               </View>
                               {/* Descripción */}
                               {selectedRecipeForModal.descripcion && (
                                   <View style={{ marginBottom: 12 }}>
                                       <Text style={{ fontWeight: 'bold', color: '#4C5F00', marginBottom: 2 }}>Descripción</Text>
                                       <Text style={{ color: '#555', fontSize: 15 }}>{selectedRecipeForModal.descripcion}</Text>
                                   </View>
                               )}
                               {/* Tags */}
                               {selectedRecipeForModal.tags && selectedRecipeForModal.tags.length > 0 && (
                                   <View style={{ marginBottom: 12 }}>
                                       <Text style={{ fontWeight: 'bold', color: '#4C5F00', marginBottom: 2 }}>Etiquetas</Text>
                                       <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                                           {selectedRecipeForModal.tags.map((tag, idx) => (
                                               <View key={idx} style={{ backgroundColor: '#E8F5E8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 6 }}>
                                                   <Text style={{ color: '#4C5F00', fontSize: 13 }}>{tag}</Text>
                                               </View>
                                           ))}
                                       </View>
                                   </View>
                               )}
                               {/* Ingredientes */}
                               {selectedRecipeForModal.ingredientes && selectedRecipeForModal.ingredientes.length > 0 && (
                                   <View style={{ marginBottom: 12 }}>
                                       <Text style={{ fontWeight: 'bold', color: '#4C5F00', marginBottom: 2 }}>Ingredientes</Text>
                                       {selectedRecipeForModal.ingredientes.map((ingredient, idx) => (
                                           <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 }}>
                                               <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#4C5F00', marginTop: 8, marginRight: 10 }} />
                                               <Text style={{ color: '#555', fontSize: 15 }}>
                                                   {ingredient.cantidad} {ingredient.unidadMedida} de {ingredient.ingrediente}
                                               </Text>
                                           </View>
                                       ))}
                                   </View>
                               )}
                               {/* Pasos */}
                               {selectedRecipeForModal.pasos && selectedRecipeForModal.pasos.length > 0 && (
                                   <View style={{ marginBottom: 12 }}>
                                       <Text style={{ fontWeight: 'bold', color: '#4C5F00', marginBottom: 2 }}>Preparación</Text>
                                       {selectedRecipeForModal.pasos.map((step, idx) => (
                                           <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
                                               <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#4C5F00', justifyContent: 'center', alignItems: 'center', marginRight: 10, marginTop: 2 }}>
                                                   <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>{idx + 1}</Text>
                                               </View>
                                               <Text style={{ color: '#555', fontSize: 15, flex: 1 }}>{step}</Text>
                                           </View>
                                       ))}
                                   </View>
                               )}
                               <View style={{ height: 10 }} />
                           </ScrollView>
                       )}
                       <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%', gap: 10, marginTop: 10 }}>
                           <TouchableOpacity
                               style={[styles.modalButton, styles.approveModalButton]}
                               onPress={handleApproveFromModal}
                               disabled={actionLoading}
                           >
                               <Text style={styles.modalButtonText}>Aprobar</Text>
                           </TouchableOpacity>
                           <TouchableOpacity
                               style={[styles.modalButton, styles.rejectModalButton]}
                               onPress={handleRejectFromModal}
                               disabled={actionLoading}
                           >
                               <Text style={styles.modalButtonText}>Rechazar</Text>
                           </TouchableOpacity>
                           <TouchableOpacity
                               style={[styles.modalButton, styles.cancelButton]}
                               onPress={handleCloseModal}
                               disabled={actionLoading}
                           >
                               <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cerrar</Text>
                           </TouchableOpacity>
                       </View>
                   </View>
               </View>
           </Modal>
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
   emptyContainer: {
       alignItems: 'center',
       paddingVertical: 60,
       paddingHorizontal: 20,
   },
   emptyTitle: {
       fontSize: 22,
       fontWeight: 'bold',
       color: '#4C5F00',
       marginTop: 20,
       marginBottom: 10,
   },
   emptyText: {
       fontSize: 16,
       color: '#666',
       textAlign: 'center',
       lineHeight: 22,
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
       justifyContent: 'space-between',
   },
   recipeBackgroundImage: {
       borderRadius: 15,
   },
   recipeHeader: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       padding: 15,
       backgroundColor: 'rgba(0, 0, 0, 0.3)',
       borderTopLeftRadius: 15,
       borderTopRightRadius: 15,
   },
   authorInfo: {
       flexDirection: 'row',
       alignItems: 'center',
       flex: 1,
   },
   authorAvatar: {
       width: 30,
       height: 30,
       borderRadius: 15,
       marginRight: 10,
       borderWidth: 2,
       borderColor: '#fff',
   },
   authorName: {
       color: '#fff',
       fontSize: 14,
       fontWeight: 'bold',
       textShadowColor: 'rgba(0, 0, 0, 0.75)',
       textShadowOffset: { width: 1, height: 1 },
       textShadowRadius: 2,
       flex: 1,
   },
   actionButtons: {
       flexDirection: 'row',
       gap: 8,
   },
   approveButton: {
       backgroundColor: '#4CAF50',
       borderRadius: 20,
       width: 36,
       height: 36,
       justifyContent: 'center',
       alignItems: 'center',
       elevation: 2,
       shadowColor: '#000',
       shadowOffset: {
           width: 0,
           height: 1,
       },
       shadowOpacity: 0.22,
       shadowRadius: 2.22,
   },
   rejectButton: {
       backgroundColor: '#f44336',
       borderRadius: 20,
       width: 36,
       height: 36,
       justifyContent: 'center',
       alignItems: 'center',
       elevation: 2,
       shadowColor: '#000',
       shadowOffset: {
           width: 0,
           height: 1,
       },
       shadowOpacity: 0.22,
       shadowRadius: 2.22,
   },
   recipeFooter: {
       backgroundColor: 'rgba(0, 0, 0, 0.6)',
       padding: 15,
       borderBottomLeftRadius: 15,
       borderBottomRightRadius: 15,
   },
   recipeTitle: {
       color: '#fff',
       fontSize: 16,
       fontWeight: 'bold',
       textShadowColor: 'rgba(0, 0, 0, 0.75)',
       textShadowOffset: { width: 1, height: 1 },
       textShadowRadius: 2,
       marginBottom: 4,
   },
   submittedDate: {
       color: '#fff',
       fontSize: 12,
       opacity: 0.8,
       textShadowColor: 'rgba(0, 0, 0, 0.75)',
       textShadowOffset: { width: 1, height: 1 },
       textShadowRadius: 2,
   },
   modalBackground: {
       flex: 1,
       backgroundColor: 'rgba(0,0,0,0.3)',
       justifyContent: 'center',
       alignItems: 'center',
   },
   modalBox: {
       backgroundColor: '#C4B04E',
       padding: 25,
       borderRadius: 15,
       width: '85%',
       alignItems: 'center',
   },
   modalIcon: {
       fontSize: 28,
       marginBottom: 10,
   },
   modalTitle: {
       fontSize: 18,
       fontWeight: 'bold',
       color: '#000',
       marginBottom: 15,
       textAlign: 'center',
   },
   modalText: {
       fontSize: 14,
       color: '#1C1C1C',
       textAlign: 'center',
       marginBottom: 20,
       lineHeight: 18,
   },
   buttonContainer: {
       flexDirection: 'row',
       gap: 10,
       marginTop: 10,
   },
   modalButton: {
       backgroundColor: '#4C5F00',
       paddingVertical: 10,
       paddingHorizontal: 20,
       borderRadius: 20,
       minWidth: 80,
       alignItems: 'center',
   },
   modalButtonText: {
       color: '#fff',
       fontWeight: 'bold',
       fontSize: 14,
   },
   cancelButton: {
       backgroundColor: 'transparent',
       borderWidth: 1,
       borderColor: '#4C5F00',
   },
   cancelButtonText: {
       color: '#4C5F00',
   },
   approveModalButton: {
       backgroundColor: '#4CAF50',
   },
   rejectModalButton: {
       backgroundColor: '#f44336',
   },
});