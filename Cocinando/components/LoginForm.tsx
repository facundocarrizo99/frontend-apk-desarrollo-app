import Checkbox from 'expo-checkbox';
import { router } from "expo-router";
import { useState } from 'react';
import {
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(false);
    const [errorVisible, setErrorVisible] = useState<boolean>(false);

    const handleSubmit= async () => {
        if (!email || !password) {
            setErrorVisible(true);
            return;
        }
        router.replace('/homeScreen');
        //TODO: Consultar API para iniciar sesión
        // try {
        //     const response = await fetch('http://localhost:8080/api/login', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ email, password }),
        //     });
        //
        //     const data = await response.json();
        //
        //     if (response.ok) {
        //         // Login successful, handle user data
        //         console.log('Login success:', data);
        //         //ir a HomeScreen
        //         <Redirect href="../app/homeScreen" />
        //     } else {
        //         // Login failed, show error
        //         setErrorVisible(true);
        //     }
        // } catch (error) {
        //     setErrorVisible(true);
        // }
        // console.log({ email, password, remember });
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
                />
                <TextInput
                    placeholder="Contraseña"
                    secureTextEntry
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                />

                <View style={styles.checkboxContainer}>
                    <Checkbox value={remember} onValueChange={setRemember} />
                    <Text style={styles.checkboxLabel}>Recordar mis datos</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/recuperarPassword')}>
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
                            Falta cargar datos.{"\n"}
                            Por favor comuníquese con el área de soporte:{"\n"}
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