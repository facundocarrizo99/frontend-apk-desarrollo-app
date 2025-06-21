import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform, Image } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { apiService } from '../services/api';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const IMAGE_QUALITY = 0.8;

type ImageInfo = {
  uri: string;
  width: number;
  height: number;
  type?: string;
  base64?: string;
};

export const pickImage = async (options: ImagePicker.ImagePickerOptions = {}) => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso a tu galería para seleccionar una imagen.'
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
      ...options,
    });

    if (result.canceled) {
      return null;
    }

    // In newer versions of expo-image-picker, the result structure changed
    const image = 'assets' in result ? result.assets?.[0] : (result as any);
    
    if (!image) {
      return null;
    }

    return {
      uri: image.uri,
      width: image.width,
      height: image.height,
      type: image.type || 'image/jpeg', // Default to jpeg if type is not available
      base64: image.base64,
    } as ImageInfo;
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('Error', 'No se pudo seleccionar la imagen. Por favor, inténtalo de nuevo.');
    return null;
  }
};

export const takePhoto = async (options: ImagePicker.ImagePickerOptions = {}) => {
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso a tu cámara para tomar una foto.'
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
      ...options,
    });

    if (result.canceled) {
      return null;
    }

    // In newer versions of expo-image-picker, the result structure changed
    const image = 'assets' in result ? result.assets?.[0] : (result as any);
    
    if (!image) {
      return null;
    }

    return {
      uri: image.uri,
      width: image.width,
      height: image.height,
      type: image.type || 'image/jpeg', // Default to jpeg if type is not available
      base64: image.base64,
    } as ImageInfo;
  } catch (error) {
    console.error('Error taking photo:', error);
    Alert.alert('Error', 'No se pudo tomar la foto. Por favor, inténtalo de nuevo.');
    return null;
  }
};

export const processAndUploadImage = async (
  imageInfo: ImageInfo,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    uploadPath?: string;
  } = {}
): Promise<string | null> => {
  try {
    const { uri, type } = imageInfo;
    const { maxWidth = 1200, maxHeight = 1200, quality = IMAGE_QUALITY } = options;

    // Check file size
    const fileInfo = await FileSystem.getInfoAsync(uri);
    
    if (!(fileInfo.exists) || fileInfo?.size && fileInfo?.size > MAX_IMAGE_SIZE) {
      Alert.alert(
        'Imagen demasiado grande',
        'La imagen seleccionada es demasiado grande. Por favor, selecciona una imagen de menos de 5MB.'
      );
      return null;
    }

    // Resize and compress image
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: maxWidth, height: maxHeight } }],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG, base64: false }
    );

    // Upload to server
    const uploadUrl = await apiService.uploadFile(manipResult.uri, type || 'image/jpeg');
    
    return uploadUrl;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Error al procesar la imagen');
  }
};

export const getImageSize = async (uri: string) => {
  try {
    const result = await FileSystem.getInfoAsync(uri);
    
    if (!result.exists) {
      console.warn(`File at ${uri} doesn't exist`);
      return { width: 0, height: 0 };
    }

    const { width, height } = await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        Image.getSize(
          uri,
          (width: any, height: any) => resolve({ width, height }),
          reject
        );
      }
    );

    return { width, height };
  } catch (error) {
    console.error('Error getting image size:', error);
    return { width: 0, height: 0 };
  }
};

// Helper function to handle avatar upload
export const handleAvatarUpload = async (): Promise<string | null> => {
  try {
    // First, let the user choose where to get the image from
    const action = await new Promise<'camera' | 'library' | null>((resolve) => {
      Alert.alert(
        'Seleccionar imagen',
        '¿De dónde quieres seleccionar la imagen?',
        [
          { text: 'Cámara', onPress: () => resolve('camera') },
          { text: 'Galería', onPress: () => resolve('library') },
          { text: 'Cancelar', style: 'cancel', onPress: () => resolve(null) },
        ],
        { cancelable: true, onDismiss: () => resolve(null) }
      );
    });

    if (!action) return null;

    // Get the image based on user's choice
    const imageInfo = action === 'camera' 
      ? await takePhoto() 
      : await pickImage();

    if (!imageInfo) return null;

    // Process and upload the image
    const uploadUrl = await processAndUploadImage(imageInfo, {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
    });

    return uploadUrl;
  } catch (error) {
    console.error('Error in handleAvatarUpload:', error);
    Alert.alert('Error', 'No se pudo cargar la imagen. Por favor, inténtalo de nuevo.');
    return null;
  }
};
