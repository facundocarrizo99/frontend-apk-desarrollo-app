import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Linking, Modal, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { UserManager } from '../utils/userManager';


export default function Header() {
   const [menuVisible, setMenuVisible] = useState<boolean>(false);
   const [profileVisible, setProfileVisible] = useState<boolean>(false);
   const [infoVisible, setInfoVisible] = useState<boolean>(false);
   const [confirmVisible, setConfirmVisible] = useState<boolean>(false);
   const [infoTitle, setInfoTitle] = useState<string>('');
   const [infoMessage, setInfoMessage] = useState<string>('');


   const showInfo = (title: string, message: string) => {
       setInfoTitle(title);
       setInfoMessage(message);
       setInfoVisible(true);
   };


   const showConfirmLogout = () => {
       setConfirmVisible(true);
   };


   const handleMenuOption = (option: string) => {
       setMenuVisible(false);
       switch (option) {
           case 'web':
               // TODO: Cambiar por la URL real de la empresa
               Linking.openURL('https://cocinando.com.ar');
               break;
           case 'faq':
               showInfo('Próximamente', 'La sección de preguntas frecuentes estará disponible pronto.');
               break;
           case 'ayuda':
               showInfo('Ayuda', 'Para soporte técnico contacta a:\nsoporte@cocinando.org');
               break;
       }
   };


   const handleProfileOption = (option: string) => {
       setProfileVisible(false);
       switch (option) {
           case 'mis-recetas':
               showInfo('Próximamente', 'La sección mis recetas estará disponible pronto.');
               break;
           case 'editar-perfil':
               router.push('/editarPerfil');
               break;
           case 'aprobar-recetas':
               showInfo('Panel de Administración', 'Función para aprobar recetas pendientes estará disponible pronto.');
               break;
           case 'aprobar-comentarios':
               showInfo('Panel de Administración', 'Función para aprobar comentarios pendientes estará disponible pronto.');
               break;
           case 'cerrar-sesion':
               showConfirmLogout();
               break;
       }
   };


   const handleLogout = () => {
       setConfirmVisible(false);
       UserManager.logout();
       router.replace('/login');
   };


   return (
       <View style={styles.container}>
           <StatusBar barStyle="light-content" backgroundColor="#4C5F00" />
          
           <View style={styles.header}>
               {/* Menú hamburguesa */}
               <TouchableOpacity onPress={() => setMenuVisible(true)}>
                   <Ionicons name="menu" size={28} color="white" />
               </TouchableOpacity>


               {/* Logo y título */}
               <View style={styles.logoContainer}>
                   <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                   <Text style={styles.title}>Cocinando</Text>
               </View>


               {/* Menú de perfil */}
               <TouchableOpacity onPress={() => setProfileVisible(true)}>
                   <Ionicons name="person-circle" size={28} color="white" />
               </TouchableOpacity>
           </View>


           {/* Modal del menú principal */}
           <Modal
               transparent
               visible={menuVisible}
               animationType="fade"
               onRequestClose={() => setMenuVisible(false)}
           >
               <View style={styles.modalBackground}>
                   <View style={styles.modalBox}>
                       <Text style={styles.modalTitle}>Menú</Text>


                       <TouchableOpacity
                           style={styles.menuItem}
                           onPress={() => handleMenuOption('web')}
                       >
                           <Ionicons name="globe-outline" size={20} color="#4C5F00" />
                           <Text style={styles.menuText}>Web oficial de empresa</Text>
                       </TouchableOpacity>


                       <TouchableOpacity
                           style={styles.menuItem}
                           onPress={() => handleMenuOption('faq')}
                       >
                           <Ionicons name="help-circle-outline" size={20} color="#4C5F00" />
                           <Text style={styles.menuText}>Preguntas frecuentes</Text>
                       </TouchableOpacity>


                       <TouchableOpacity
                           style={styles.menuItem}
                           onPress={() => handleMenuOption('ayuda')}
                       >
                           <Ionicons name="information-circle-outline" size={20} color="#4C5F00" />
                           <Text style={styles.menuText}>Ayuda</Text>
                       </TouchableOpacity>


                       <TouchableOpacity
                           style={styles.modalButton}
                           onPress={() => setMenuVisible(false)}
                       >
                           <Text style={styles.modalButtonText}>Cerrar</Text>
                       </TouchableOpacity>
                   </View>
               </View>
           </Modal>


           {/* Modal del menú de perfil */}
           <Modal
               transparent
               visible={profileVisible}
               animationType="fade"
               onRequestClose={() => setProfileVisible(false)}
           >
               <View style={styles.modalBackground}>
                   <View style={styles.modalBox}>
                       <Text style={styles.modalTitle}>Mi Perfil</Text>


                       <TouchableOpacity
                           style={styles.menuItem}
                           onPress={() => handleProfileOption('mis-recetas')}
                       >
                           <Ionicons name="book-outline" size={20} color="#4C5F00" />
                           <Text style={styles.menuText}>Mis recetas</Text>
                       </TouchableOpacity>


                       <TouchableOpacity
                           style={styles.menuItem}
                           onPress={() => handleProfileOption('editar-perfil')}
                       >
                           <Ionicons name="person-outline" size={20} color="#4C5F00" />
                           <Text style={styles.menuText}>Editar perfil</Text>
                       </TouchableOpacity>


                       {/* Opciones solo para administradores */}
                       {UserManager.isAdmin() && (
                           <>
                               <TouchableOpacity
                                   style={styles.menuItem}
                                   onPress={() => handleProfileOption('aprobar-recetas')}
                               >
                                   <Ionicons name="checkmark-circle-outline" size={20} color="#4C5F00" />
                                   <Text style={styles.menuText}>Aprobar recetas</Text>
                               </TouchableOpacity>


                               <TouchableOpacity
                                   style={styles.menuItem}
                                   onPress={() => handleProfileOption('aprobar-comentarios')}
                               >
                                   <Ionicons name="chatbubble-ellipses-outline" size={20} color="#4C5F00" />
                                   <Text style={styles.menuText}>Aprobar comentarios</Text>
                               </TouchableOpacity>
                           </>
                       )}


                       <TouchableOpacity
                           style={[styles.menuItem, styles.menuItemDanger]}
                           onPress={() => handleProfileOption('cerrar-sesion')}
                       >
                           <Ionicons name="log-out-outline" size={20} color="#d32f2f" />
                           <Text style={[styles.menuText, styles.menuTextDanger]}>Cerrar sesión</Text>
                       </TouchableOpacity>


                       <TouchableOpacity
                           style={styles.modalButton}
                           onPress={() => setProfileVisible(false)}
                       >
                           <Text style={styles.modalButtonText}>Cerrar</Text>
                       </TouchableOpacity>
                   </View>
               </View>
           </Modal>


           {/* Modal de información */}
           <Modal
               transparent
               visible={infoVisible}
               animationType="fade"
               onRequestClose={() => setInfoVisible(false)}
           >
               <View style={styles.modalBackground}>
                   <View style={styles.modalBox}>
                       <Text style={styles.modalIcon}>ℹ️</Text>
                       <Text style={styles.modalTitle}>{infoTitle}</Text>
                       <Text style={styles.modalText}>{infoMessage}</Text>
                       <TouchableOpacity
                           style={styles.modalButton}
                           onPress={() => setInfoVisible(false)}
                       >
                           <Text style={styles.modalButtonText}>Entendido</Text>
                       </TouchableOpacity>
                   </View>
               </View>
           </Modal>


           {/* Modal de confirmación de cerrar sesión */}
           <Modal
               transparent
               visible={confirmVisible}
               animationType="fade"
               onRequestClose={() => setConfirmVisible(false)}
           >
               <View style={styles.modalBackground}>
                   <View style={styles.modalBox}>
                       <Text style={styles.modalIcon}>🚪</Text>
                       <Text style={styles.modalTitle}>Cerrar Sesión</Text>
                       <Text style={styles.modalText}>
                           ¿Estás seguro que deseas cerrar sesión?
                       </Text>
                       <View style={styles.buttonContainer}>
                           <TouchableOpacity
                               style={[styles.modalButton, styles.cancelButton]}
                               onPress={() => setConfirmVisible(false)}
                           >
                               <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancelar</Text>
                           </TouchableOpacity>
                           <TouchableOpacity
                               style={[styles.modalButton, styles.confirmButton]}
                               onPress={handleLogout}
                           >
                               <Text style={styles.modalButtonText}>Cerrar Sesión</Text>
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
       backgroundColor: '#4C5F00',
   },
   header: {
       backgroundColor: '#4C5F00',
       padding: 15,
       paddingTop: Platform.OS === 'ios' ? 50 : 35,
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
   },
   logoContainer: {
       flexDirection: 'row',
       alignItems: 'center',
   },
   logo: {
       width: 30,
       height: 30,
       marginRight: 8,
   },
   title: {
       color: 'white',
       fontWeight: 'bold',
       fontSize: 18,
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
   modalTitle: {
       fontSize: 18,
       fontWeight: 'bold',
       color: '#000',
       marginBottom: 20,
       textAlign: 'center',
   },
   modalIcon: {
       fontSize: 28,
       marginBottom: 10,
   },
   modalText: {
       fontSize: 14,
       color: '#1C1C1C',
       textAlign: 'center',
       marginBottom: 20,
       lineHeight: 18,
   },
   menuItem: {
       flexDirection: 'row',
       alignItems: 'center',
       paddingVertical: 12,
       width: '100%',
   },
   menuItemDanger: {
       borderTopWidth: 1,
       borderTopColor: '#9A8A3E',
       marginTop: 8,
       paddingTop: 16,
   },
   menuText: {
       marginLeft: 12,
       fontSize: 16,
       color: '#1C1C1C',
   },
   menuTextDanger: {
       color: '#d32f2f',
   },
   modalButton: {
       backgroundColor: '#4C5F00',
       paddingVertical: 8,
       paddingHorizontal: 20,
       borderRadius: 20,
       marginTop: 20,
   },
   modalButtonText: {
       color: '#fff',
       fontWeight: 'bold',
   },
   buttonContainer: {
       flexDirection: 'row',
       gap: 10,
       marginTop: 10,
   },
   cancelButton: {
       backgroundColor: 'transparent',
       borderWidth: 1,
       borderColor: '#4C5F00',
   },
   cancelButtonText: {
       color: '#4C5F00',
   },
   confirmButton: {
       backgroundColor: '#d32f2f',
   },
});