import { Recipe, RecipeActionResponse, RecipesApiResponse } from '../types/Recipie';
import { APP_CONFIG, devLog } from './config';
import { UserManager } from './userManager';


// Recetas pendientes de ejemplo para fallback
const fallbackPendingRecipes: Recipe[] = [
   {
       _id: '1',
       titulo: 'Milanesas de berenjena',
       descripcion: 'Deliciosas milanesas de berenjena crujientes',
       imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       autor: {
           _id: '1',
           name: 'María González',
           email: 'maria@example.com',
           avatar: 'https://randomuser.me/api/portraits/women/15.jpg',
           role: 'alumno',
           createdAt: '2024-01-15T10:00:00.000Z',
           updatedAt: '2024-01-15T10:00:00.000Z',
           __v: 0,
           id: '1'
       },
       fechaCreacion: '2024-01-15T10:00:00.000Z',
       fechaModificacion: '2024-01-15T10:00:00.000Z',
       aprobado: false
   },
   {
       _id: '2',
       titulo: 'Tarta de espinaca casera',
       descripcion: 'Tarta casera con espinaca fresca y queso',
       imagen: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       autor: {
           _id: '2',
           name: 'Roberto Silva',
           email: 'roberto@example.com',
           avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
           role: 'alumno',
           createdAt: '2024-01-14T15:30:00.000Z',
           updatedAt: '2024-01-14T15:30:00.000Z',
           __v: 0,
           id: '2'
       },
       fechaCreacion: '2024-01-14T15:30:00.000Z',
       fechaModificacion: '2024-01-14T15:30:00.000Z',
       aprobado: false
   }
];


export const PendingRecipesService = {
   // Obtener recetas pendientes de la API
   getPendingRecipes: async (): Promise<{ success: boolean; recipes?: Recipe[]; error?: string }> => {
       try {
           const token = UserManager.getAuthToken();
          
           if (!token) {
               devLog('No hay token de autenticación disponible');
               return {
                   success: false,
                   error: 'No hay token de autenticación'
               };
           }


           devLog('Obteniendo recetas pendientes de la API');
          
           const response = await fetch(`${APP_CONFIG.API_BASE_URL}${APP_CONFIG.ENDPOINTS.RECIPES_PENDING}`, {
               method: 'GET',
               headers: {
                   'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json',
               },
           });


           const data: RecipesApiResponse = await response.json();
          
           devLog('Respuesta de API recetas pendientes:', data);


           if (response.ok && data.status === 'success') {
               // Normalizar las recetas para compatibilidad
               const normalizedRecipes = data.data.recetas.map(recipe => ({
                   ...recipe,
                   // Agregar campos de compatibilidad
                   title: recipe.titulo,
                   image: recipe.imagen,
                   author: {
                       _id: recipe.autor._id,
                       name: recipe.autor.name,
                       avatar: recipe.autor.avatar
                   },
                   approved: recipe.aprobado,
                   createdAt: recipe.fechaCreacion,
                   updatedAt: recipe.fechaModificacion
               }));
              
               devLog(`Recetas pendientes obtenidas: ${normalizedRecipes.length} recetas`);
              
               return {
                   success: true,
                   recipes: normalizedRecipes
               };
           } else {
               devLog('Error en la respuesta de la API de recetas pendientes');
               return {
                   success: false,
                   error: 'Error al obtener recetas pendientes de la API'
               };
           }
       } catch (error) {
           console.error('Error al obtener recetas pendientes:', error);
           devLog('Error de conexión al obtener recetas pendientes', error);
          
           // En caso de error, devolver recetas de fallback
           devLog('Usando recetas pendientes de fallback debido al error');
           return {
               success: true,
               recipes: fallbackPendingRecipes
           };
       }
   },


   // Aprobar una receta
   approveRecipe: async (recipeId: string): Promise<{ success: boolean; error?: string }> => {
       try {
           const token = UserManager.getAuthToken();
          
           if (!token) {
               devLog('No hay token de autenticación disponible');
               return {
                   success: false,
                   error: 'No hay token de autenticación'
               };
           }


           devLog(`Aprobando receta ${recipeId}`);
          
           const endpoint = APP_CONFIG.ENDPOINTS.RECIPE_APPROVE.replace(':id', recipeId);
           const response = await fetch(`${APP_CONFIG.API_BASE_URL}${endpoint}`, {
               method: 'PATCH',
               headers: {
                   'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json',
               },
           });


           const data: RecipeActionResponse = await response.json();
          
           devLog('Respuesta de aprobar receta:', data);


           if (response.ok && data.status === 'success') {
               devLog(`Receta ${recipeId} aprobada exitosamente`);
               return {
                   success: true
               };
           } else {
               devLog('Error al aprobar receta');
               return {
                   success: false,
                   error: data.message || 'Error al aprobar la receta'
               };
           }
       } catch (error) {
           console.error('Error al aprobar receta:', error);
           devLog('Error de conexión al aprobar receta', error);
          
           return {
               success: false,
               error: 'Error de conexión al aprobar la receta'
           };
       }
   },


   // Rechazar (eliminar) una receta
   rejectRecipe: async (recipeId: string): Promise<{ success: boolean; error?: string }> => {
       try {
           const token = UserManager.getAuthToken();
          
           if (!token) {
               devLog('No hay token de autenticación disponible');
               return {
                   success: false,
                   error: 'No hay token de autenticación'
               };
           }


           devLog(`Rechazando receta ${recipeId}`);
          
           const endpoint = APP_CONFIG.ENDPOINTS.RECIPE_DELETE.replace(':id', recipeId);
           const response = await fetch(`${APP_CONFIG.API_BASE_URL}${endpoint}`, {
               method: 'DELETE',
               headers: {
                   'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json',
               },
           });


           const data: RecipeActionResponse = await response.json();
          
           devLog('Respuesta de rechazar receta:', data);


           if (response.ok) {
               devLog(`Receta ${recipeId} rechazada exitosamente`);
               return {
                   success: true
               };
           } else {
               devLog('Error al rechazar receta');
               return {
                   success: false,
                   error: data.message || 'Error al rechazar la receta'
               };
           }
       } catch (error) {
           console.error('Error al rechazar receta:', error);
           devLog('Error de conexión al rechazar receta', error);
          
           return {
               success: false,
               error: 'Error de conexión al rechazar la receta'
           };
       }
   },


   // Obtener recetas de fallback para desarrollo
   getFallbackRecipes: (): Recipe[] => {
       devLog('Usando recetas pendientes de fallback');
       return fallbackPendingRecipes;
   }
};