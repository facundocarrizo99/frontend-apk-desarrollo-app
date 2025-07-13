import Checkbox from 'expo-checkbox';
import { router } from "expo-router";
import { useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { APP_CONFIG, devLog } from '../utils/config';
import { UserManager } from '../utils/userManager';


export default function LoginForm() {
   const [email, setEmail] = useState<string>('');
   const [password, setPassword] = useState<string>('');
   const [remember, setRemember] = useState<boolean>(false);
   const [errorVisible, setErrorVisible] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [errorMessage, setErrorMessage] = useState<string>('');


   const handleSubmit = async () => {
       if (!email || !password) {
           setErrorMessage('Por favor completa todos los campos');
           setErrorVisible(true);
           return;
       }


       setLoading(true);
       devLog('Iniciando login', { email, useAPI: APP_CONFIG.USE_API });


       try {
           if (APP_CONFIG.USE_API) {
               // Usar API real
               const result = await UserManager.login(email, password);
              
               if (result.success && result.user) {
                   // Login exitoso
                   devLog('Login exitoso con API', result.user);
                   setLoading(false);
                   router.replace('/homeScreen');
               } else {
                   // Login fallido
                   devLog('Login fallido con API', result.error);
                   setLoading(false);
                   setErrorMessage(result.error || 'Error al iniciar sesión');
                   setErrorVisible(true);
               }
           } else {
               // Usar login local para desarrollo
               handleLocalLogin();
               setLoading(false);
           }
       } catch (error) {
           devLog('Error en login', error);
           setLoading(false);
           setErrorMessage('Error de conexión. Verifica tu internet.');
           setErrorVisible(true);
       }
   };


   const handleLocalLogin = () => {
       // Función auxiliar para testing con usuarios locales
       if (!email || !password) {
           setErrorMessage('Por favor completa todos los campos');
           setErrorVisible(true);
           return;
       }


       const result = UserManager.loginLocal(email, password);
      
       if (result.success && result.user) {
           devLog('Login local exitoso', result.user);
           router.replace('/homeScreen');
       } else {
           setErrorMessage(
               `Credenciales incorrectas.\n\n` +
               `Usuarios de prueba:\n` +
               `Admin: admin@cocinando.org\n` +
               `Alumno: pedro.perez@email.com\n` +
               `Contraseña: 123456`
           );
           setErrorVisible(true);
       }
   };


   return (
       <View style={styles.container}>
           <View style={styles.card}>
               <Text style={styles.title}>Iniciar Sesión</Text>


               <TextInput
                   placeholder="Alias o Email"
                   style={styles.input}
                   value={email}
                   onChangeText={setEmail}
                   editable={!loading}
                   autoCapitalize="none"
                   keyboardType="email-address"
               />
               <TextInput
                   placeholder="Contraseña"
                   secureTextEntry
                   style={styles.input}
                   value={password}
                   onChangeText={setPassword}
                   editable={!loading}
               />


               <View style={styles.checkboxContainer}>
                   <Checkbox value={remember} onValueChange={setRemember} disabled={loading} />
                   <Text style={styles.checkboxLabel}>Recordar mis datos</Text>
               </View>


               <TouchableOpacity
                   style={[styles.button, loading && styles.buttonDisabled]}
                   onPress={handleSubmit}
                   disabled={loading}
               >
                   {loading ? (
                       <ActivityIndicator color="#fff" size="small" />
                   ) : (
                       <Text style={styles.buttonText}>Enviar</Text>
                   )}
               </TouchableOpacity>


               {/* Botón de desarrollo para login local */}
               {APP_CONFIG.DEV.SHOW_LOCAL_LOGIN && (
                   <TouchableOpacity
                       style={[styles.button, styles.devButton]}
                       onPress={handleLocalLogin}
                       disabled={loading}
                   >
                       <Text style={styles.buttonText}>Login Local (Dev)</Text>
                   </TouchableOpacity>
               )}


               <TouchableOpacity onPress={() => router.push('/(auth)/recuperarPassword' as any)}>
                   <Text style={styles.forgotPassword}>Olvidé mi contraseña</Text>
               </TouchableOpacity>
           </View>


           {/* Modal de Error */}
           <Modal
               transparent
               visible={errorVisible}
               animationType="fade"
               onRequestClose={() => setErrorVisible(false)}
           >
               <View style={styles.modalBackground}>
                   <View style={styles.modalBox}>
                       <Text style={styles.modalWarning}>⚠️</Text>
                       <Text style={styles.modalTitle}>Error al iniciar sesión</Text>
                       <Text style={styles.modalText}>
                           {errorMessage}
                       </Text>
                       <TouchableOpacity
                           style={styles.modalButton}
                           onPress={() => setErrorVisible(false)}
                       >
                           <Text style={styles.modalButtonText}>Cerrar</Text>
                       </TouchableOpacity>
                   </View>
               </View>
           </Modal>
       </View>
   );
}


const styles = StyleSheet.create({
   container: {
       alignItems: 'center',
       width: '100%',
   },
   card: {
       backgroundColor: '#C4B04E',
       marginTop: 40,
       padding: 20,
       borderRadius: 10,
       width: '90%',
       alignItems: 'center',
   },
   title: {
       fontSize: 20,
       fontWeight: 'bold',
       marginBottom: 20,
       color: '#000',
   },
   input: {
       backgroundColor: '#fff',
       borderRadius: 30,
       width: '100%',
       paddingVertical: Platform.OS === 'ios' ? 14 : 10,
       paddingHorizontal: 20,
       marginVertical: 8,
   },
   checkboxContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       marginVertical: 8,
       alignSelf: 'flex-start',
   },
   checkboxLabel: {
       marginLeft: 8,
       color: '#333',
   },
   button: {
       backgroundColor: '#4C5F00',
       paddingHorizontal: 20,
       paddingVertical: 10,
       borderRadius: 30,
       marginVertical: 10,
   },
   buttonText: {
       color: '#fff',
       fontWeight: 'bold',
   },
   buttonDisabled: {
       backgroundColor: '#ccc',
   },
   devButton: {
       backgroundColor: '#007bff',
       marginTop: 10,
   },
   forgotPassword: {
       color: '#1C1C1C',
       textDecorationLine: 'underline',
       marginTop: 10,
       fontSize: 13,
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
       marginTop: 10,
       marginBottom: 8,
       textAlign: 'center',
   },
   modalWarning: {
       fontSize: 28,
   },
   modalText: {
       fontSize: 14,
       color: '#1C1C1C',
       textAlign: 'center',
       marginBottom: 20,
   },
   modalButton: {
       backgroundColor: '#4C5F00',
       paddingVertical: 8,
       paddingHorizontal: 20,
       borderRadius: 20,
   },
   modalButtonText: {
       color: '#fff',
       fontWeight: 'bold',
   },
});