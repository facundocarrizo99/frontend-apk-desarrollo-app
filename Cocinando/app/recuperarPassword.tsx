import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { PasswordRecoveryService } from '../utils/passwordRecoveryService';
import { passwordRecoveryState } from '../utils/passwordRecoveryState';

export default function RecuperarPasswordScreen() {
    const [email, setEmail] = useState<string>('');
    const [errorVisible, setErrorVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successVisible, setSuccessVisible] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (!email) {
            setErrorMessage('Por favor ingresa tu email');
            setErrorVisible(true);
            return;
        }

        // Validar formato de email
        if (!PasswordRecoveryService.validateEmail(email)) {
            setErrorMessage('Por favor ingresa un email válido');
            setErrorVisible(true);
            return;
        }

        setLoading(true);

        try {
            const result = await PasswordRecoveryService.sendVerificationCode(email);
            
            if (result.success) {
                // Guardar el email en el estado global
                passwordRecoveryState.setEmail(email);
                passwordRecoveryState.setCodeVerified(false);
                
                // Mostrar mensaje de éxito
                setSuccessVisible(true);
            } else {
                setErrorMessage(result.error || 'Error al enviar el código de verificación');
                setErrorVisible(true);
            }
        } catch (error) {
            setErrorMessage('Error de conexión. Verifica tu internet.');
            setErrorVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        setSuccessVisible(false);
        router.push('/verificarCodigo');
    };



    return (
        <View style={styles.container}>
            <Header />
            
            <View style={styles.formContainer}>
                <View style={styles.card}>
                    <Text style={styles.title}>Recuperar Contraseña</Text>
                    <Text style={styles.description}>
                        Ingresa tu alias o email para recibir instrucciones de recuperación
                    </Text>

                    <TextInput
                        placeholder="Alias o Email"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

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

                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backToLogin}>Volver al inicio de sesión</Text>
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
                        <Text style={styles.modalTitle}>Código Enviado</Text>
                        <Text style={styles.modalText}>
                            Se ha enviado un código de verificación a tu email.{"\n"}
                            Revisa tu bandeja de entrada y spam.
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
                        <Text style={styles.modalTitle}>Error</Text>
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
        marginBottom: 10,
        color: '#000',
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 18,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 30,
        width: '100%',
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
        paddingHorizontal: 20,
        marginVertical: 8,
    },
    button: {
        backgroundColor: '#4C5F00',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        marginVertical: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    backToLogin: {
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