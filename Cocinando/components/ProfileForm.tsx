import React, {JSX, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileForm(): JSX.Element {
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        nacimiento: '',
        nacionalidad: '',
        password: '',
        repeatPassword: '',
        image: null as string | null,
    });

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            setForm({ ...form, image: result.assets[0].uri });
        }
    };

    const handleChange = (field: keyof typeof form, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleSubmit = () => {
        console.log('Formulario enviado:', form);
        // Aquí puedes integrar lógica de validación y envío a backend
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar perfil</Text>

            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={form.nombre}
                onChangeText={(text) => handleChange('nombre', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={form.apellido}
                onChangeText={(text) => handleChange('apellido', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Fecha de nacimiento"
                value={form.nacimiento}
                onChangeText={(text) => handleChange('nacimiento', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Nacionalidad"
                value={form.nacionalidad}
                onChangeText={(text) => handleChange('nacionalidad', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                value={form.password}
                onChangeText={(text) => handleChange('password', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Repetir contraseña"
                secureTextEntry
                value={form.repeatPassword}
                onChangeText={(text) => handleChange('repeatPassword', text)}
            />

            <Text style={styles.label}>Añadir foto de perfil</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
                {form.image ? (
                    <Image source={{ uri: form.image }} style={styles.imagePreview} />
                ) : (
                    <Text>📷 Buscar...</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitText}>Enviar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#b3a242',
        padding: 20,
        margin: 20,
        borderRadius: 20,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        marginBottom: 10,
    },
    label: {
        marginTop: 10,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    imagePicker: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    submitButton: {
        backgroundColor: '#3e6613',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
