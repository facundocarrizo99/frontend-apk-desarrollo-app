import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { User } from '../types/Recipie';
import { UserManager } from '../utils/userManager';
import { UserService } from '../utils/userService';


export default function ProfileForm() {
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(false);
   const [form, setForm] = useState({
       name: '',
       apellido: '',
       email: '',
       fechaNacimiento: '',
       nacionalidad: '',
   });


   // Cargar datos del usuario actual
   useEffect(() => {
       const currentUser = UserManager.getCurrentUser();
       console.log('DEBUG - Usuario actual:', currentUser);
      
       if (currentUser) {
           setUser(currentUser);
           const formData = {
               name: currentUser.name || '',
               apellido: currentUser.apellido || '', // Cargar apellido si existe
               email: currentUser.email || '',
               fechaNacimiento: currentUser.fechaNacimiento || '', // Cargar fecha si existe
               nacionalidad: currentUser.nacionalidad || currentUser.nationality || '', // Usar cualquiera de los dos campos
           };
          
           console.log('DEBUG - Datos del formulario:', formData);
           setForm(formData);
       } else {
           console.log('DEBUG - No hay usuario actual');
       }
   }, []);


   const handleChange = (field: keyof typeof form, value: string) => {
       setForm({ ...form, [field]: value });
   };


   const validateForm = (): boolean => {
       if (!form.name.trim()) {
           Alert.alert('Error', 'El nombre es obligatorio');
           return false;
       }
       if (!form.email.trim()) {
           Alert.alert('Error', 'El email es obligatorio');
           return false;
       }
       if (!form.email.includes('@')) {
           Alert.alert('Error', 'El email no tiene un formato válido');
           return false;
       }
       return true;
   };


   const handleSubmit = async () => {
       if (!validateForm()) {
           return;
       }


                setLoading(true);
       try {
           console.log('DEBUG - Enviando datos:', form);
           const result = await UserService.updateProfile(form);
           console.log('DEBUG - Resultado del servicio:', result);
          
           if (result.success && result.user) {
               // Actualizar usuario en memoria
               UserManager.updateCurrentUser(result.user);
               setUser(result.user);
              
               // Actualizar formulario con los nuevos datos
               setForm({
                   name: result.user.name || '',
                   apellido: result.user.apellido || '',
                   email: result.user.email || '',
                   fechaNacimiento: result.user.fechaNacimiento || '',
                   nacionalidad: result.user.nacionalidad || result.user.nationality || '',
               });
              
               console.log('DEBUG - Usuario actualizado en formulario:', result.user);
              
               Alert.alert(
                   'Éxito',
                   'Perfil actualizado correctamente',
                   [
                       {
                           text: 'OK',
                           onPress: () => router.replace('/perfil')
                       }
                   ]
               );
           } else {
               console.log('DEBUG - Error en actualización:', result.error);
               Alert.alert('Error', result.error || 'Error al actualizar el perfil');
           }
       } catch (error) {
           console.error('Error al actualizar perfil:', error);
           Alert.alert('Error', 'Error de conexión al actualizar el perfil');
       } finally {
           setLoading(false);
       }
   };


   const handleCancel = () => {
       router.back();
   };


   if (!user) {
       return (
           <View style={styles.loadingContainer}>
               <ActivityIndicator size="large" color="#C4B04E" />
               <Text style={styles.loadingText}>Cargando datos del perfil...</Text>
           </View>
       );
   }


   return (
       <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
           <View style={styles.container}>
               <Text style={styles.title}>Editar perfil</Text>


               <View style={styles.formGroup}>
                   <Text style={styles.label}>Nombre *</Text>
                   <TextInput
                       style={styles.input}
                       placeholder="Ingresa tu nombre"
                       value={form.name}
                       onChangeText={(text) => handleChange('name', text)}
                       editable={!loading}
                   />
               </View>


               <View style={styles.formGroup}>
                   <Text style={styles.label}>Apellido</Text>
                   <TextInput
                       style={styles.input}
                       placeholder="Ingresa tu apellido"
                       value={form.apellido}
                       onChangeText={(text) => handleChange('apellido', text)}
                       editable={!loading}
                   />
               </View>


               <View style={styles.formGroup}>
                   <Text style={styles.label}>Email *</Text>
                   <TextInput
                       style={styles.input}
                       placeholder="Ingresa tu email"
                       value={form.email}
                       onChangeText={(text) => handleChange('email', text)}
                       keyboardType="email-address"
                       autoCapitalize="none"
                       editable={!loading}
                   />
               </View>


               <View style={styles.formGroup}>
                   <Text style={styles.label}>Fecha de nacimiento</Text>
                   <TextInput
                       style={styles.input}
                       placeholder="YYYY-MM-DD (ej: 1990-05-15)"
                       value={form.fechaNacimiento}
                       onChangeText={(text) => handleChange('fechaNacimiento', text)}
                       editable={!loading}
                   />
               </View>


               <View style={styles.formGroup}>
                   <Text style={styles.label}>Nacionalidad</Text>
                   <TextInput
                       style={styles.input}
                       placeholder="Ingresa tu nacionalidad"
                       value={form.nacionalidad}
                       onChangeText={(text) => handleChange('nacionalidad', text)}
                       editable={!loading}
                   />
               </View>


               {/* Sección de contraseña deshabilitada */}
               <View style={styles.disabledSection}>
                   <View style={styles.disabledHeader}>
                       <Ionicons name="lock-closed-outline" size={20} color="#999" />
                       <Text style={styles.disabledTitle}>Cambio de contraseña</Text>
                   </View>
                   <Text style={styles.disabledText}>
                       Esta funcionalidad estará disponible próximamente
                   </Text>
               </View>


               {/* Botones de acción */}
               <View style={styles.buttonContainer}>
                   <TouchableOpacity
                       style={[styles.button, styles.cancelButton]}
                       onPress={handleCancel}
                       disabled={loading}
                   >
                       <Text style={styles.cancelButtonText}>Cancelar</Text>
                   </TouchableOpacity>


                   <TouchableOpacity
                       style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
                       onPress={handleSubmit}
                       disabled={loading}
                   >
                       {loading ? (
                           <View style={styles.loadingButton}>
                               <ActivityIndicator size="small" color="#fff" />
                               <Text style={styles.submitText}>Guardando...</Text>
                           </View>
                       ) : (
                           <Text style={styles.submitText}>Guardar cambios</Text>
                       )}
                   </TouchableOpacity>
               </View>
           </View>
       </ScrollView>
   );
}


const styles = StyleSheet.create({
   scrollContainer: {
       flex: 1,
       backgroundColor: '#fff',
   },
   container: {
       backgroundColor: '#C4B04E',
       padding: 20,
       margin: 20,
       borderRadius: 20,
   },
   title: {
       textAlign: 'center',
       fontWeight: 'bold',
       fontSize: 22,
       marginBottom: 20,
       color: '#000',
   },
   formGroup: {
       marginBottom: 15,
   },
   label: {
       marginBottom: 5,
       fontWeight: 'bold',
       fontSize: 14,
       color: '#000',
   },
   input: {
       backgroundColor: '#fff',
       paddingHorizontal: 15,
       paddingVertical: 12,
       borderRadius: 10,
       fontSize: 16,
       borderWidth: 1,
       borderColor: '#E0E0E0',
   },
   disabledSection: {
       backgroundColor: 'rgba(255, 255, 255, 0.7)',
       padding: 15,
       borderRadius: 10,
       marginTop: 10,
       marginBottom: 20,
   },
   disabledHeader: {
       flexDirection: 'row',
       alignItems: 'center',
       marginBottom: 8,
   },
   disabledTitle: {
       marginLeft: 8,
       fontSize: 16,
       fontWeight: 'bold',
       color: '#999',
   },
   disabledText: {
       fontSize: 14,
       color: '#666',
       fontStyle: 'italic',
   },
   buttonContainer: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       gap: 10,
       marginTop: 10,
   },
   button: {
       flex: 1,
       padding: 15,
       borderRadius: 10,
       alignItems: 'center',
       justifyContent: 'center',
       minHeight: 50,
   },
   cancelButton: {
       backgroundColor: '#fff',
       borderWidth: 2,
       borderColor: '#4C5F00',
   },
   cancelButtonText: {
       color: '#4C5F00',
       fontWeight: 'bold',
       fontSize: 16,
   },
   submitButton: {
       backgroundColor: '#4C5F00',
   },
   submitText: {
       color: '#fff',
       fontWeight: 'bold',
       fontSize: 16,
   },
   buttonDisabled: {
       opacity: 0.7,
   },
   loadingButton: {
       flexDirection: 'row',
       alignItems: 'center',
       gap: 8,
   },
   loadingContainer: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       backgroundColor: '#fff',
       padding: 20,
   },
   loadingText: {
       marginTop: 16,
       fontSize: 16,
       color: '#666',
   },
});