import { Recipe } from '../types/Recipie';
import { APP_CONFIG, devLog } from './config';
import { UserManager } from './userManager';


// Respuesta de la API de favoritos
interface FavoritesApiResponse {
   status: string;
   data: {
       favorites: Recipe[];
   };
}


// Respuesta de la API para agregar/remover favoritos
interface FavoriteActionResponse {
   status: string;
   message?: string;
   data?: any;
}


export const FavoritesService = {
   // Obtener recetas favoritas del usuario
   getFavorites: async (): Promise<{ success: boolean; recipes?: Recipe[]; error?: string }> => {
       try {
           const token = UserManager.getAuthToken();
          
           if (!token) {
               devLog('No hay token de autenticación disponible para favoritos');
               return {
                   success: false,
                   error: 'No hay token de autenticación'
               };
           }


           devLog('Obteniendo recetas favoritas de la API');
          
           const response = await fetch(`${APP_CONFIG.API_BASE_URL}${APP_CONFIG.ENDPOINTS.FAVORITES_GET}`, {
               method: 'GET',
               headers: {
                   'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json',
               },
           });


           const data: FavoritesApiResponse = await response.json();
          
           devLog('Respuesta de API favoritos:', data);


           if (response.ok && data.status === 'success') {
               const favorites = data.data.favorites || [];
              
               devLog(`Favoritos obtenidos: ${favorites.length} recetas`);
              
               return {
                   success: true,
                   recipes: favorites
               };
           } else {
               devLog('Error en la respuesta de la API de favoritos');
               return {
                   success: false,
                   error: 'Error al obtener favoritos de la API'
               };
           }
       } catch (error) {
           console.error('Error al obtener favoritos:', error);
           devLog('Error de conexión al obtener favoritos', error);
          
           return {
               success: false,
               error: 'Error de conexión al obtener favoritos'
           };
       }
   },


   // Agregar receta a favoritos
   addToFavorites: async (recipeId: string): Promise<{ success: boolean; error?: string }> => {
       try {
           const token = UserManager.getAuthToken();
          
           if (!token) {
               devLog('No hay token de autenticación disponible para agregar a favoritos');
               return {
                   success: false,
                   error: 'No hay token de autenticación'
               };
           }


           devLog(`Agregando receta a favoritos: ${recipeId}`);
          
           const url = `${APP_CONFIG.API_BASE_URL}${APP_CONFIG.ENDPOINTS.FAVORITES_ADD.replace(':recipeId', recipeId)}`;
          
           const response = await fetch(url, {
               method: 'POST',
               headers: {
                   'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json',
               },
           });


           const data: FavoriteActionResponse = await response.json();
          
           devLog('Respuesta de API agregar favorito:', data);


           if (response.ok && data.status === 'success') {
               devLog(`Receta agregada a favoritos exitosamente: ${recipeId}`);
              
               return {
                   success: true
               };
           } else {
               devLog('Error al agregar receta a favoritos');
               return {
                   success: false,
                   error: data?.message || 'Error al agregar receta a favoritos'
               };
           }
       } catch (error) {
           console.error('Error al agregar receta a favoritos:', error);
           devLog('Error de conexión al agregar a favoritos', error);
          
           return {
               success: false,
               error: 'Error de conexión al agregar a favoritos'
           };
       }
   },


   // Remover receta de favoritos
   removeFromFavorites: async (recipeId: string): Promise<{ success: boolean; error?: string }> => {
       try {
           const token = UserManager.getAuthToken();
          
           if (!token) {
               devLog('No hay token de autenticación disponible para remover de favoritos');
               return {
                   success: false,
                   error: 'No hay token de autenticación'
               };
           }


           devLog(`Removiendo receta de favoritos: ${recipeId}`);
          
           const url = `${APP_CONFIG.API_BASE_URL}${APP_CONFIG.ENDPOINTS.FAVORITES_REMOVE.replace(':recipeId', recipeId)}`;
          
           const response = await fetch(url, {
               method: 'DELETE',
               headers: {
                   'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json',
               },
           });


           const data: FavoriteActionResponse = await response.json();
          
           devLog('Respuesta de API remover favorito:', data);


           if (response.ok && data.status === 'success') {
               devLog(`Receta removida de favoritos exitosamente: ${recipeId}`);
              
               return {
                   success: true
               };
           } else {
               devLog('Error al remover receta de favoritos');
               return {
                   success: false,
                   error: data?.message || 'Error al remover receta de favoritos'
               };
           }
       } catch (error) {
           console.error('Error al remover receta de favoritos:', error);
           devLog('Error de conexión al remover de favoritos', error);
          
           return {
               success: false,
               error: 'Error de conexión al remover de favoritos'
           };
       }
   },


   // Verificar si una receta está en favoritos
   isFavorite: async (recipeId: string): Promise<{ success: boolean; isFavorite?: boolean; error?: string }> => {
       try {
           const favoritesResult = await this.getFavorites();
          
           if (!favoritesResult.success) {
               return {
                   success: false,
                   error: favoritesResult.error
               };
           }


           const favorites = favoritesResult.recipes || [];
           const isFavorite = favorites.some((recipe: Recipe) => recipe._id === recipeId);
          
           return {
               success: true,
               isFavorite: isFavorite
           };
       } catch (error) {
           console.error('Error al verificar si es favorito:', error);
           return {
               success: false,
               error: 'Error al verificar favorito'
           };
       }
   }
};