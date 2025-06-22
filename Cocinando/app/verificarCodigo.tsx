import { router } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';


export default function VerificarCodigoScreen() {
   const [codigo, setCodigo] = useState<string>('');
   const [successVisible, setSuccessVisible] = useState<boolean>(false);
   const [errorVisible, setErrorVisible] = useState<boolean>(false);


   const handleSubmit = async () => {
       if (!codigo) {
           setErrorVisible(true);
           return;
       }
      
       // TODO: Consultar API para verificar código
       // try {
       //     const response = await fetch('http://localhost:8080/api/verify-code', {
       //         method: 'POST',
       //         headers: { 'Content-Type': 'application/json' },
       //         body: JSON.stringify({ code: codigo }),
       //     });
       //    
       //     if (response.ok) {
       //         setSuccessVisible(true);
       //     } else {
       //         setErrorVisible(true);
       //     }
       // } catch (error) {
       //     setErrorVisible(true);
       // }
      
       // Por ahora mostramos el modal de éxito
       setSuccessVisible(true);
   };


   const handleSuccess = () => {
       setSuccessVisible(false);
       // TODO: Navegar a pantalla de cambiar contraseña o volver al login
       router.replace('/login');
   };


   const handleResendCode = () => {
       // TODO: Reenviar código
       alert('Código reenviado a tu correo electrónico');
   };


   return (
       <View style={styles.container}>
           <Header />
          
           <View style={styles.formContainer}>
               <View style={styles.card}>
                   <Text style={styles.title}>Recuperar Contraseña</Text>
                  
                   <TextInput
                       placeholder="Código de verificación"
                       style={styles.input}
                       value={codigo}
                       onChangeText={setCodigo}
                       keyboardType="numeric"
                       maxLength={6}
                       textAlign="center"
                   />


                   <Text style={styles.infoText}>
                       Le enviamos un código verificador a su correo electrónico
                   </Text>


                   <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                       <Text style={styles.buttonText}>Verificar</Text>
                   </TouchableOpacity>


                   <TouchableOpacity onPress={handleResendCode}>
                       <Text style={styles.resendText}>Reenviar código</Text>
                   </TouchableOpacity>


                   <TouchableOpacity onPress={() => router.back()}>
                       <Text style={styles.backText}>Volver</Text>
                   </TouchableOpacity>
               </View>
           </View>


           {/* Modal de Éxito */}
           <Modal
               transparent
               visible={successVisible}
               animationType="fade"
               onRequestClose={() => setSuccessVisible(false)}
           >
               <View style={styles.modalBackground}>
                   <View style={styles.modalBox}>
                       <Text style={styles.modalSuccess}>✅</Text>
                       <Text style={styles.modalTitle}>Código Verificado</Text>
                       <Text style={styles.modalText}>
                           Tu código ha sido verificado correctamente.{"\n"}
                           Ahora puedes iniciar sesión nuevamente.
                       </Text>
                       <TouchableOpacity
                           style={styles.modalButton}
                           onPress={handleSuccess}
                       >
                           <Text style={styles.modalButtonText}>Continuar</Text>
                       </TouchableOpacity>
                   </View>
               </View>
           </Modal>


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
                       <Text style={styles.modalTitle}>Código Incorrecto</Text>
                       <Text style={styles.modalText}>
                           El código ingresado no es válido.{"\n"}
                           Por favor verifica e intenta nuevamente.{"\n"}
                           Si el problema persiste, comunícate con soporte:{"\n"}
                           soporte@cocinando.org
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
       flex: 1,
       backgroundColor: '#fff',
   },
   formContainer: {
       alignItems: 'center',
       width: '100%',
       flex: 1,
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
       textAlign: 'center',
   },
   input: {
       backgroundColor: '#fff',
       borderRadius: 30,
       width: '100%',
       paddingVertical: Platform.OS === 'ios' ? 14 : 10,
       paddingHorizontal: 20,
       marginVertical: 8,
       fontSize: 18,
       letterSpacing: 2,
   },
   infoText: {
       fontSize: 14,
       color: '#333',
       textAlign: 'center',
       marginTop: 15,
       marginBottom: 20,
       lineHeight: 18,
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
   resendText: {
       color: '#1C1C1C',
       textDecorationLine: 'underline',
       marginTop: 10,
       fontSize: 13,
   },
   backText: {
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
   modalSuccess: {
       fontSize: 28,
   },
   modalWarning: {
       fontSize: 28,
   },
   modalText: {
       fontSize: 14,
       color: '#1C1C1C',
       textAlign: 'center',
       marginBottom: 20,
       lineHeight: 18,
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
