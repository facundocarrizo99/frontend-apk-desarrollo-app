import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';

interface FormData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  image: string | null;
  password: string;
  confirmPassword: string;
}

export default function ProfileForm() {
  const { authState, updateProfile, refreshUser } = useAuth();
  const { user } = authState;
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    bio: '',
    image: null,
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        image: user.avatar || null,
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos permiso para acceder a tu galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setForm({ ...form, image: result.assets[0].uri });
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (form.password && form.password !== form.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      const updateData: any = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        bio: form.bio,
      };
      
      if (form.image) {
        updateData.avatar = form.image;
      }
      
      if (form.password) {
        updateData.password = form.password;
      }

      await updateProfile(updateData);
      await refreshUser(); // Refresh user data after update
      
      Alert.alert('¡Listo!', 'Tu perfil ha sido actualizado', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#4C5F00" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handlePickImage}>
          <View style={styles.avatarWrapper}>
            {form.image ? (
              <Image 
                source={{ uri: form.image }} 
                style={styles.avatar} 
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={40} color="#9E9E9E" />
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarText}>Cambiar foto de perfil</Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre completo"
          value={form.name}
          onChangeText={(value) => handleChange('name', value)}
          editable={!isLoading}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tucorreo@ejemplo.com"
          value={form.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Teléfono (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="+54 9 11 1234-5678"
          value={form.phone}
          onChangeText={(value) => handleChange('phone', value)}
          keyboardType="phone-pad"
          editable={!isLoading}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Acerca de ti (opcional)</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Cuéntanos un poco sobre ti..."
          value={form.bio}
          onChangeText={(value) => handleChange('bio', value)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          editable={!isLoading}
        />
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nueva Contraseña</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            value={form.password}
            onChangeText={(value) => handleChange('password', value)}
            secureTextEntry
            editable={!isLoading}
          />
          <Ionicons name="lock-closed" size={20} color="#9E9E9E" style={styles.inputIcon} />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirmar Contraseña</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••"
            value={form.confirmPassword}
            onChangeText={(value) => handleChange('confirmPassword', value)}
            secureTextEntry
            editable={!isLoading}
          />
          <Ionicons name="lock-closed" size={20} color="#9E9E9E" style={styles.inputIcon} />
        </View>
        <Text style={styles.hintText}>
          {form.password && form.password.length < 6 
            ? 'La contraseña debe tener al menos 6 caracteres' 
            : 'Deja en blanco para mantener la contraseña actual'}
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.saveButtonText}>Guardar Cambios</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#b3a242',
    padding: 20,
    margin: 20,
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4C5F00',
    padding: 5,
    borderRadius: 50,
  },
  avatarText: {
    marginTop: 10,
    fontSize: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#DDDDDD',
    borderWidth: 1,
  },
  bioInput: {
    height: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDDDDD',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: '#DDDDDD',
    borderWidth: 1,
  },
  inputIcon: {
    marginLeft: 10,
  },
  hintText: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#4C5F00',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
