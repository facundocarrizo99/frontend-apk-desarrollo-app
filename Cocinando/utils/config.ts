// Configuración de la aplicación
export const APP_CONFIG = {
   // Cambiar a false para usar login local en desarrollo
   USE_API: true,
  
   // URLs de la API - ACTUALIZAR CON TU URL REAL
   // Ejemplos comunes:
   // - Desarrollo local: 'http://localhost:3000/api'
   // - Servidor remoto: 'https://tu-api.com/api'
   // - Ngrok o similar: 'https://abc123.ngrok.io/api'
   API_BASE_URL: 'https://backend-api-desarrollo-app.onrender.com/api', // <-- CAMBIAR POR TU URL
  
   // Endpoints
   ENDPOINTS: {
       LOGIN: '/user/auth/login',
       LOGOUT: '/user/auth/logout',
       REGISTER: '/user/auth/register',
       RECOVER_PASSWORD: '/user/auth/recover-password',
       VERIFY_CODE: '/user/auth/verify-code',
       CHANGE_PASSWORD: '/user/auth/change-password',
   },
  
   // Configuración de desarrollo
   DEV: {
       SHOW_LOCAL_LOGIN: __DEV__, // Solo mostrar botón local en modo desarrollo
       LOG_API_CALLS: __DEV__, // Log de llamadas API en desarrollo
   }
};


// Helper para logs en desarrollo
export const devLog = (message: string, data?: any) => {
   if (APP_CONFIG.DEV.LOG_API_CALLS) {
       console.log(`[DEV] ${message}`, data || '');
   }
};