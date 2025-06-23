import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import Header from '../components/Header';


// Lista de recetas pendientes de aprobación
const recetasPendientes = [
   {
       id: '1',
       title: 'Milanesas de berenjena',
       image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       author: 'María González',
       authorAvatar: 'https://randomuser.me/api/portraits/women/15.jpg',
       submittedDate: '2024-01-15',
   },
   {
       id: '2',
       title: 'Tarta de espinaca casera',
       image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       author: 'Roberto Silva',
       authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
       submittedDate: '2024-01-14',
   },
   {
       id: '3',
       title: 'Sopa de calabaza y jengibre',
       image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       author: 'Laura Fernández',
       authorAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
       submittedDate: '2024-01-13',
   },
   {
       id: '4',
       title: 'Brownies veganos',
       image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       author: 'Diego Morales',
       authorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
       submittedDate: '2024-01-12',
   },
   {
       id: '5',
       title: 'Ensalada mediterránea',
       image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       author: 'Carmen Ruiz',
       authorAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
       submittedDate: '2024-01-11',
   },
];


export default function AprobarRecetasScreen() {
   const [recetas, setRecetas] = useState(recetasPendientes);
   const [confirmVisible, setConfirmVisible] = useState(false);
   const [successVisible, setSuccessVisible] = useState(false);
   const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
   const [selectedRecipe, setSelectedRecipe] = useState<{id: string, title: string} | null>(null);
   const [successMessage, setSuccessMessage] = useState('');


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


   const executeAction = () => {
       if (!selectedRecipe || !confirmAction) return;
      
       setRecetas(prev => prev.filter(recipe => recipe.id !== selectedRecipe.id));
       setConfirmVisible(false);
      
       if (confirmAction === 'approve') {
           setSuccessMessage(`La receta "${selectedRecipe.title}" ha sido aprobada.`);
       } else {
           setSuccessMessage(`La receta "${selectedRecipe.title}" ha sido rechazada.`);
       }
      
       setSuccessVisible(true);
       setSelectedRecipe(null);
       setConfirmAction(null);
   };


   const cancelAction = () => {
       setConfirmVisible(false);
       setSelectedRecipe(null);
       setConfirmAction(null);
   };


   return (
       <View style={styles.container}>
           <Header />
          
           <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                           <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
                               <ImageBackground
                                   source={{ uri: recipe.image }}
                                   style={styles.recipeBackground}
                                   imageStyle={styles.recipeBackgroundImage}
                               >
                                   {/* Header de la receta con autor y botones de acción */}
                                   <View style={styles.recipeHeader}>
                                       <View style={styles.authorInfo}>
                                           <Image source={{ uri: recipe.authorAvatar }} style={styles.authorAvatar} />
                                           <Text style={styles.authorName}>{recipe.author}</Text>
                                       </View>
                                      
                                       {/* Botones de aprobar y rechazar */}
                                       <View style={styles.actionButtons}>
                                           <TouchableOpacity
                                               style={styles.approveButton}
                                               onPress={() => handleApprove(recipe.id, recipe.title)}
                                           >
                                               <Ionicons name="checkmark" size={20} color="#fff" />
                                           </TouchableOpacity>
                                           <TouchableOpacity
                                               style={styles.rejectButton}
                                               onPress={() => handleReject(recipe.id, recipe.title)}
                                           >
                                               <Ionicons name="close" size={20} color="#fff" />
                                           </TouchableOpacity>
                                       </View>
                                   </View>


                                   {/* Footer con nombre de la receta */}
                                   <View style={styles.recipeFooter}>
                                       <Text style={styles.recipeTitle}>{recipe.title}</Text>
                                       <Text style={styles.submittedDate}>
                                           Enviada: {new Date(recipe.submittedDate).toLocaleDateString('es-ES')}
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
                           >
                               <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancelar</Text>
                           </TouchableOpacity>
                           <TouchableOpacity
                               style={[styles.modalButton, confirmAction === 'approve' ? styles.approveModalButton : styles.rejectModalButton]}
                               onPress={executeAction}
                           >
                               <Text style={styles.modalButtonText}>
                                   {confirmAction === 'approve' ? 'Aprobar' : 'Rechazar'}
                               </Text>
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
                       <Text style={styles.modalIcon}>🎉</Text>
                       <Text style={styles.modalTitle}>¡Éxito!</Text>
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
   emptyContainer: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       paddingVertical: 60,
   },
   emptyTitle: {
       fontSize: 18,
       fontWeight: 'bold',
       color: '#4C5F00',
       marginTop: 16,
       marginBottom: 8,
   },
   emptyText: {
       fontSize: 14,
       color: '#666',
       textAlign: 'center',
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
       alignItems: 'center',
       justifyContent: 'space-between',
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
       backgroundColor: '#4C5F00',
       width: 36,
       height: 36,
       borderRadius: 18,
       justifyContent: 'center',
       alignItems: 'center',
       elevation: 2,
       shadowColor: '#000',
       shadowOffset: {
           width: 0,
           height: 1,
       },
       shadowOpacity: 0.2,
       shadowRadius: 1.41,
   },
   rejectButton: {
       backgroundColor: '#D32F2F',
       width: 36,
       height: 36,
       borderRadius: 18,
       justifyContent: 'center',
       alignItems: 'center',
       elevation: 2,
       shadowColor: '#000',
       shadowOffset: {
           width: 0,
           height: 1,
       },
       shadowOpacity: 0.2,
       shadowRadius: 1.41,
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
       opacity: 0.9,
       textShadowColor: 'rgba(0, 0, 0, 0.75)',
       textShadowOffset: { width: 1, height: 1 },
       textShadowRadius: 2,
   },
   // Estilos para modales
   modalBackground: {
       flex: 1,
       backgroundColor: 'rgba(0, 0, 0, 0.5)',
       justifyContent: 'center',
       alignItems: 'center',
   },
   modalBox: {
       backgroundColor: '#C4B04E',
       borderRadius: 15,
       padding: 20,
       margin: 20,
       alignItems: 'center',
       elevation: 5,
       shadowColor: '#000',
       shadowOffset: {
           width: 0,
           height: 2,
       },
       shadowOpacity: 0.25,
       shadowRadius: 3.84,
       minWidth: 280,
   },
   modalIcon: {
       fontSize: 48,
       marginBottom: 15,
   },
   modalTitle: {
       fontSize: 18,
       fontWeight: 'bold',
       color: '#000',
       marginBottom: 10,
       textAlign: 'center',
   },
   modalText: {
       fontSize: 14,
       color: '#000',
       textAlign: 'center',
       marginBottom: 20,
       lineHeight: 20,
   },
   buttonContainer: {
       flexDirection: 'row',
       gap: 10,
       width: '100%',
   },
   modalButton: {
       backgroundColor: '#4C5F00',
       paddingVertical: 12,
       paddingHorizontal: 20,
       borderRadius: 8,
       flex: 1,
       alignItems: 'center',
   },
   modalButtonText: {
       color: '#fff',
       fontSize: 14,
       fontWeight: 'bold',
   },
   cancelButton: {
       backgroundColor: '#666',
   },
   cancelButtonText: {
       color: '#fff',
   },
   approveModalButton: {
       backgroundColor: '#4C5F00',
   },
   rejectModalButton: {
       backgroundColor: '#D32F2F',
   },
});