import { Alert } from 'react-native';
import { AxiosError } from 'axios';

interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export const handleApiError = (error: unknown, defaultMessage = 'Algo salió mal. Por favor, inténtalo de nuevo.') => {
  console.error('API Error:', error);
  
  const axiosError = error as AxiosError<ApiError>;
  
  // Handle network errors
  if (error instanceof Error && error.message === 'Network Error') {
    Alert.alert('Error de conexión', 'No se pudo conectar al servidor. Verifica tu conexión a internet.');
    return;
  }
  
  // Handle HTTP errors with response
  if (axiosError.response) {
    const { status, data } = axiosError.response;
    const errorMessage = data?.message || defaultMessage;
    
    switch (status) {
      case 400:
        // Handle validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          Alert.alert('Error de validación', errorMessages);
        } else {
          Alert.alert('Solicitud incorrecta', errorMessage);
        }
        break;
      case 401:
        // Unauthorized - handled by auth interceptor
        break;
      case 403:
        Alert.alert('Acceso denegado', 'No tienes permiso para realizar esta acción.');
        break;
      case 404:
        Alert.alert('No encontrado', 'El recurso solicitado no existe.');
        break;
      case 429:
        Alert.alert('Demasiadas solicitudes', 'Has excedido el límite de solicitudes. Por favor, espera un momento.');
        break;
      case 500:
        Alert.alert('Error del servidor', 'Algo salió mal en el servidor. Por favor, inténtalo de nuevo más tarde.');
        break;
      default:
        Alert.alert('Error', errorMessage);
    }
  } else {
    // Handle other errors
    Alert.alert('Error', defaultMessage);
  }
};

// Helper to handle form errors
export const getFormErrors = (error: unknown): Record<string, string> => {
  const axiosError = error as AxiosError<{ errors?: Record<string, string[]> }>;
  
  if (axiosError.response?.data?.errors) {
    const errors: Record<string, string> = {};
    
    Object.entries(axiosError.response.data.errors).forEach(([field, messages]) => {
      errors[field] = messages.join(' ');
    });
    
    return errors;
  }
  
  return {};
};

// Helper to handle error messages in forms
export const getErrorMessage = (error: unknown, field: string): string | undefined => {
  const errors = getFormErrors(error);
  return errors[field];
};
