import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { PasswordRecoveryService } from '../utils/passwordRecoveryService';
import { passwordRecoveryState } from '../utils/passwordRecoveryState';

export default function VerificarCodigoScreen() {
    const [codigo, setCodigo] = useState<string>('');
    const [errorVisible, setErrorVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    useEffect(() => {
        // Obtener el email del estado global
        const currentEmail = passwordRecoveryState.getEmail();
        if (!currentEmail) {
            // Si no hay email, redirigir al inicio del flujo
            router.replace('/recuperarPassword');
            return;
        }
        setEmail(currentEmail);
    }, []);

    const handleSubmit = async () => {
        if (!codigo) {
            setErrorMessage('Por favor ingresa el código de verificación');
            setErrorVisible(true);
            return;
        }

        // Validar código
        const validation = PasswordRecoveryService.validateVerificationCode(codigo);
        if (!validation.isValid) {
            setErrorMessage(validation.message || 'Código inválido');
            setErrorVisible(true);
            return;
        }

        setLoading(true);

        try {
            const result = await PasswordRecoveryService.verifyResetCode(email, codigo);
            
            if (result.success) {
                // Marcar el código como verificado y guardarlo
                passwordRecoveryState.setCode(codigo);
                passwordRecoveryState.setCodeVerified(true);
                
                // Redirigir a la pantalla de cambiar contraseña
                router.push('/cambiarPassword');
            } else {
                setErrorMessage(result.error || 'El código ingresado no es válido');
                setErrorVisible(true);
            }
        } catch (error) {
            setErrorMessage('Error de conexión. Verifica tu internet.');
            setErrorVisible(true);
        } finally {
            setLoading(false);
        }
    };



    const handleResendCode = async () => {
        if (!email) {
            setErrorMessage('Error: No se encontró el email. Reinicia el proceso.');
            setErrorVisible(true);
            return;
        }

        setLoading(true);

        try {
            const result = await PasswordRecoveryService.resendVerificationCode(email);
            
            if (result.success) {
                alert('Código reenviado a tu correo electrónico');
            } else {
                setErrorMessage(result.error || 'Error al reenviar el código');
                setErrorVisible(true);
            }
        } catch (error) {
            setErrorMessage('Error de conexión. Verifica tu internet.');
            setErrorVisible(true);
        } finally {
            setLoading(false);
        }
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

                    <TouchableOpacity 
                        style={[styles.button, loading && styles.buttonDisabled]} 
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.buttonText}>Verificar</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleResendCode}>
                        <Text style={styles.resendText}>Reenviar código</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={styles.backText}>Volver</Text>
                    </TouchableOpacity>
                </View>
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
                        <Text style={styles.modalTitle}>Código Incorrecto</Text>
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
    buttonDisabled: {
        backgroundColor: '#ccc',
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