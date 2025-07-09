// Configuración de la aplicación
export const APP_CONFIG = {
   // Cambiar a false para usar login local en desarrollo
   USE_API: true,
  
   // URLs de la API - ACTUALIZAR CON TU URL REAL
   // Ejemplos comunes:
   // - Desarrollo local: 'http://localhost:3000/api'
   // - Servidor remoto: 'https://tu-api.com/api'
   // - Ngrok o similar: 'https://abc123.ngrok.io/api'
   API_BASE_URL: 'https://backend-api-desarrollo-app.onrender.com/api', // URL actualizada
  
   // Endpoints
   ENDPOINTS: {
       LOGIN: '/user/auth/login',
       LOGOUT: '/user/auth/logout',
       REGISTER: '/user/auth/register',
       RECOVER_PASSWORD: '/user/auth/recover-password',
       VERIFY_CODE: '/user/auth/verify-code',
       CHANGE_PASSWORD: '/user/auth/change-password',
       UPDATE_PROFILE: '/user/users/update-me', // Actualizar perfil del usuario
       RECIPES_APPROVED: '/recipes/approved', // Recetas aprobadas
       RECIPES_PENDING: '/recipes/pending', // Recetas pendientes de aprobación
       RECIPE_APPROVE: '/recipes/:id/approve', // Aprobar receta (reemplazar :id)
       RECIPE_DELETE: '/recipes/:id', // Eliminar receta (reemplazar :id)
       RECIPES_USER: '/recipes/user/:usuarioId', // Recetas de un usuario específico
       FAVORITES_GET: '/user/users/me/favorites', // Obtener favoritos del usuario
       FAVORITES_ADD: '/user/users/me/favorites/:recipeId', // Agregar a favoritos
       FAVORITES_REMOVE: '/user/users/me/favorites/:recipeId', // Remover de favoritos
       COMMENTS_CREATE: '/comentarios', // Crear comentario
       COMMENTS_BY_RECIPE: '/comentarios/receta/:recetaId', // Obtener comentarios aprobados por receta
       COMMENTS_PENDING: '/comentarios/pendientes', // Obtener comentarios pendientes (Admin)
       COMMENTS_APPROVE: '/comentarios/:id/aprobar', // Aprobar comentario (Admin)
       COMMENTS_DELETE: '/comentarios/:id', // Eliminar comentario (Admin)
   },
  
   // Configuración de desarrollo
   DEV: {
       SHOW_LOCAL_LOGIN: false, //__DEV__, // Automático: true en desarrollo, false en producción
       LOG_API_CALLS: false // __DEV__, // Automático: logs solo en desarrollo
   }
};


// Helper para logs en desarrollo
export const devLog = (message: string, data?: any) => {
   if (APP_CONFIG.DEV.LOG_API_CALLS) {
       console.log(`[DEV] ${message}`, data || '');
   }
};


