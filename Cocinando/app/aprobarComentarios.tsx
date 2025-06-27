import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import Header from '../components/Header';
import { useAuthGuard } from '../utils/useAuthGuard';


// Lista de comentarios pendientes de aprobación
const comentariosPendientes = [
   {
       id: '1',
       recipeTitle: 'Milanesas de berenjena',
       rating: 5,
       comment: 'Excelente receta! Las milanesas quedaron súper crujientes y sabrosas. Mi familia las amó, definitivamente la haré de nuevo.',
       author: 'María González',
       authorAvatar: 'https://randomuser.me/api/portraits/women/15.jpg',
       submittedDate: '2024-01-15',
   },
   {
       id: '2',
       recipeTitle: 'Tarta de espinaca casera',
       rating: 4,
       comment: 'Muy rica la tarta, aunque me costó un poco el armado de la masa. El relleno estaba perfecto.',
       author: 'Roberto Silva',
       authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
       submittedDate: '2024-01-14',
   },
   {
       id: '3',
       recipeTitle: 'Sopa de calabaza y jengibre',
       rating: 5,
       comment: 'Increíble combinación de sabores! La sopa quedó cremosa y el toque de jengibre le da un sabor único. Perfecta para días fríos.',
       author: 'Laura Fernández',
       authorAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
       submittedDate: '2024-01-13',
   },
   {
       id: '4',
       recipeTitle: 'Brownies veganos',
       rating: 3,
       comment: 'Buenos brownies, aunque esperaba que fueran más húmedos. El sabor a chocolate está bien pero les falta un poco de dulzor.',
       author: 'Diego Morales',
       authorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
       submittedDate: '2024-01-12',
   },
   {
       id: '5',
       recipeTitle: 'Ensalada mediterránea',
       rating: 4,
       comment: 'Fresca y saludable! Me encantó la combinación de ingredientes. Solo le agregaría un poco más de aceite de oliva.',
       author: 'Carmen Ruiz',
       authorAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
       submittedDate: '2024-01-11',
   },
   {
       id: '6',
       recipeTitle: 'Alfajores de maicena',
       rating: 5,
       comment: 'Los mejores alfajores que he probado! La textura es perfecta y el dulce de leche casero los hace aún más especiales.',
       author: 'Carlos Mendez',
       authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
       submittedDate: '2024-01-10',
   },
];


export default function AprobarComentariosScreen() {
   // Proteger la ruta
   useAuthGuard();
  
   const [comentarios, setComentarios] = useState(comentariosPendientes);
   const [confirmVisible, setConfirmVisible] = useState(false);
   const [successVisible, setSuccessVisible] = useState(false);
   const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
   const [selectedComment, setSelectedComment] = useState<{id: string, author: string} | null>(null);
   const [successMessage, setSuccessMessage] = useState('');


   const handleApprove = (commentId: string, author: string) => {
       setSelectedComment({id: commentId, author: author});
       setConfirmAction('approve');
       setConfirmVisible(true);
   };


   const handleReject = (commentId: string, author: string) => {
       setSelectedComment({id: commentId, author: author});
       setConfirmAction('reject');
       setConfirmVisible(true);
   };


   const executeAction = () => {
       if (!selectedComment || !confirmAction) return;
      
       setComentarios(prev => prev.filter(comment => comment.id !== selectedComment.id));
       setConfirmVisible(false);
      
       if (confirmAction === 'approve') {
           setSuccessMessage(`El comentario de ${selectedComment.author} ha sido aprobado.`);
       } else {
           setSuccessMessage(`El comentario de ${selectedComment.author} ha sido rechazado.`);
       }
      
       setSuccessVisible(true);
       setSelectedComment(null);
       setConfirmAction(null);
   };


   const cancelAction = () => {
       setConfirmVisible(false);
       setSelectedComment(null);
       setConfirmAction(null);
   };


   const renderStars = (rating: number) => {
       const stars = [];
       for (let i = 1; i <= 5; i++) {
           stars.push(
               <Ionicons
                   key={i}
                   name={i <= rating ? 'star' : 'star-outline'}
                   size={16}
                   color="#FFD700"
               />
           );
       }
       return stars;
   };


   return (
       <View style={styles.container}>
           <Header />
          
           <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
               {/* Título de aprobar comentarios */}
               <View style={styles.titleContainer}>
                   <Ionicons name="chatbubble-ellipses-outline" size={28} color="#4C5F00" />
                   <Text style={styles.sectionTitle}>Aprobar Comentarios</Text>
               </View>


               {comentarios.length === 0 ? (
                   <View style={styles.emptyContainer}>
                       <Ionicons name="checkmark-done-circle" size={64} color="#C4B04E" />
                       <Text style={styles.emptyTitle}>¡Todo al día!</Text>
                       <Text style={styles.emptyText}>No hay comentarios pendientes de aprobación</Text>
                   </View>
               ) : (
                   <View style={styles.commentsContainer}>
                       {comentarios.map((comment) => (
                           <View key={comment.id} style={styles.commentCard}>
                               {/* Header con título de receta y botones de acción */}
                               <View style={styles.commentHeader}>
                                   <Text style={styles.recipeTitle}>{comment.recipeTitle}</Text>
                                  
                                   {/* Botones de aprobar y rechazar */}
                                   <View style={styles.actionButtons}>
                                       <TouchableOpacity
                                           style={styles.approveButton}
                                           onPress={() => handleApprove(comment.id, comment.author)}
                                       >
                                           <Ionicons name="checkmark" size={18} color="#fff" />
                                       </TouchableOpacity>
                                       <TouchableOpacity
                                           style={styles.rejectButton}
                                           onPress={() => handleReject(comment.id, comment.author)}
                                       >
                                           <Ionicons name="close" size={18} color="#fff" />
                                       </TouchableOpacity>
                                   </View>
                               </View>


                               {/* Rating de estrellas */}
                               <View style={styles.ratingContainer}>
                                   {renderStars(comment.rating)}
                                   <Text style={styles.ratingText}>({comment.rating}/5)</Text>
                               </View>


                               {/* Autor y comentario */}
                               <View style={styles.authorCommentContainer}>
                                   <Image source={{ uri: comment.authorAvatar }} style={styles.authorAvatar} />
                                   <View style={styles.commentContent}>
                                       <Text style={styles.authorName}>{comment.author}</Text>
                                       <Text style={styles.commentText}>{comment.comment}</Text>
                                       <Text style={styles.submittedDate}>
                                           {new Date(comment.submittedDate).toLocaleDateString('es-ES')}
                                       </Text>
                                   </View>
                               </View>
                           </View>
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
                           {confirmAction === 'approve' ? 'Aprobar Comentario' : 'Rechazar Comentario'}
                       </Text>
                       <Text style={styles.modalText}>
                           {confirmAction === 'approve'
                               ? `¿Estás seguro de que quieres aprobar el comentario de "${selectedComment?.author}"?`
                               : `¿Estás seguro de que quieres rechazar el comentario de "${selectedComment?.author}"?`
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
   commentsContainer: {
       gap: 15,
       paddingBottom: 20,
   },
   commentCard: {
       backgroundColor: '#fff',
       borderRadius: 15,
       padding: 15,
       elevation: 3,
       shadowColor: '#000',
       shadowOffset: {
           width: 0,
           height: 2,
       },
       shadowOpacity: 0.1,
       shadowRadius: 3.84,
       borderWidth: 1,
       borderColor: '#f0f0f0',
   },
   commentHeader: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       marginBottom: 10,
   },
   recipeTitle: {
       fontSize: 14,
       fontWeight: 'bold',
       color: '#4C5F00',
       flex: 1,
       marginRight: 10,
   },
   actionButtons: {
       flexDirection: 'row',
       gap: 8,
   },
   approveButton: {
       backgroundColor: '#4C5F00',
       width: 32,
       height: 32,
       borderRadius: 16,
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
       width: 32,
       height: 32,
       borderRadius: 16,
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
   ratingContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       marginBottom: 12,
       gap: 2,
   },
   ratingText: {
       fontSize: 12,
       color: '#666',
       marginLeft: 8,
   },
   authorCommentContainer: {
       flexDirection: 'row',
       alignItems: 'flex-start',
       gap: 12,
   },
   authorAvatar: {
       width: 40,
       height: 40,
       borderRadius: 20,
       borderWidth: 2,
       borderColor: '#C4B04E',
   },
   commentContent: {
       flex: 1,
   },
   authorName: {
       fontSize: 14,
       fontWeight: 'bold',
       color: '#333',
       marginBottom: 4,
   },
   commentText: {
       fontSize: 14,
       color: '#555',
       lineHeight: 20,
       marginBottom: 6,
   },
   submittedDate: {
       fontSize: 12,
       color: '#999',
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