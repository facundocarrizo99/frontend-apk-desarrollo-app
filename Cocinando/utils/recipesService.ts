import { Recipe, RecipesApiResponse } from '../types/Recipie';
import { APP_CONFIG, devLog } from './config';
import { UserManager } from './userManager';


// Recetas de ejemplo para fallback
const fallbackRecipes: Recipe[] = [
   {
       _id: '1',
       id: '1',
       titulo: 'Milanesas de pollo crujientes',
       descripcion: 'Deliciosas milanesas de pollo con una cobertura extra crujiente',
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
       aprobado: true
   },
   {
       _id: '2',
       id: '2',
       titulo: 'Pasta con salsa de tomates frescos',
       descripcion: 'Una pasta simple pero deliciosa con tomates frescos del huerto',
       imagen: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
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
       aprobado: true
   },
   {
       _id: '3',
       id: '3',
       titulo: 'Ensalada mediterránea',
       descripcion: 'Ensalada fresca con aceitunas, queso feta y vegetales de temporada',
       imagen: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       autor: {
           _id: '3',
           name: 'Laura Fernández',
           email: 'laura@example.com',
           avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
           role: 'alumno',
           createdAt: '2024-01-13T12:15:00.000Z',
           updatedAt: '2024-01-13T12:15:00.000Z',
           __v: 0,
           id: '3'
       },
       fechaCreacion: '2024-01-13T12:15:00.000Z',
       fechaModificacion: '2024-01-13T12:15:00.000Z',
       aprobado: true
   },
   {
       _id: '4',
       id: '4',
       titulo: 'Brownies de chocolate',
       descripcion: 'Brownies húmedos y chocolatosos, perfectos para los amantes del chocolate',
       imagen: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       autor: {
           _id: '4',
           name: 'Diego Morales',
           email: 'diego@example.com',
           avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
           role: 'alumno',
           createdAt: '2024-01-12T09:45:00.000Z',
           updatedAt: '2024-01-12T09:45:00.000Z',
           __v: 0,
           id: '4'
       },
       fechaCreacion: '2024-01-12T09:45:00.000Z',
       fechaModificacion: '2024-01-12T09:45:00.000Z',
       aprobado: true
   }
];


export const RecipesService = {
   // Obtener recetas aprobadas de la API
   getApprovedRecipes: async (): Promise<{ success: boolean; recipes?: Recipe[]; error?: string }> => {
       try {
           const token = UserManager.getAuthToken();
          
           if (!token) {
               devLog('No hay token de autenticación disponible');
               return {
                   success: false,
                   error: 'No hay token de autenticación'
               };
           }


           devLog('Obteniendo recetas aprobadas de la API');
          
           const response = await fetch(`${APP_CONFIG.API_BASE_URL}${APP_CONFIG.ENDPOINTS.RECIPES_APPROVED}`, {
               method: 'GET',
               headers: {
                   'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json',
               },
           });


           const data: RecipesApiResponse = await response.json();
          
           devLog('Respuesta de API recetas:', data);


           if (response.ok && data.status === 'success') {
               // Si no hay recetas, usar fallback
               const recipes = data.data.recetas.length > 0 ? data.data.recetas : fallbackRecipes;
              
               devLog(`Recetas obtenidas: ${recipes.length} recetas`);
              
               return {
                   success: true,
                   recipes: recipes
               };
           } else {
               devLog('Error en la respuesta de la API de recetas');
               return {
                   success: false,
                   error: 'Error al obtener recetas de la API'
               };
           }
       } catch (error) {
           console.error('Error al obtener recetas:', error);
           devLog('Error de conexión al obtener recetas', error);
          
           // En caso de error, devolver recetas de fallback
           devLog('Usando recetas de fallback debido al error');
           return {
               success: true,
               recipes: fallbackRecipes
           };
       }
   },


   // Obtener recetas de fallback para desarrollo
   getFallbackRecipes: (): Recipe[] => {
       devLog('Usando recetas de fallback');
       return fallbackRecipes;
   },


   // Obtener recetas de un usuario específico
   getUserRecipes: async (usuarioId: string): Promise<{ success: boolean; recipes?: Recipe[]; error?: string }> => {
       try {
           const token = UserManager.getAuthToken();
          
           if (!token) {
               devLog('No hay token de autenticación disponible para recetas del usuario');
               return {
                   success: false,
                   error: 'No hay token de autenticación'
               };
           }


           devLog(`Obteniendo recetas del usuario: ${usuarioId}`);
          
           // Construir la URL reemplazando el parámetro
           const url = `${APP_CONFIG.API_BASE_URL}${APP_CONFIG.ENDPOINTS.RECIPES_USER.replace(':usuarioId', usuarioId)}`;
          
           const response = await fetch(url, {
               method: 'GET',
               headers: {
                   'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json',
               },
           });


           const data: RecipesApiResponse = await response.json();
          
           devLog('Respuesta de API recetas del usuario:', data);


           if (response.ok && data.status === 'success') {
               const recipes = data.data.recetas || [];
              
               devLog(`Recetas del usuario obtenidas: ${recipes.length} recetas`);
              
               return {
                   success: true,
                   recipes: recipes
               };
           } else {
               devLog('Error en la respuesta de la API de recetas del usuario');
               return {
                   success: false,
                   error: 'Error al obtener recetas del usuario desde la API'
               };
           }
       } catch (error) {
           console.error('Error al obtener recetas del usuario:', error);
           devLog('Error de conexión al obtener recetas del usuario', error);
          
           return {
               success: false,
               error: 'Error de conexión al obtener recetas del usuario'
           };
       }
   },


   // Buscar recetas por texto
   searchRecipes: (recipes: Recipe[], searchText: string): Recipe[] => {
       if (!searchText.trim()) {
           return recipes;
       }


       const searchLower = searchText.toLowerCase();
      
       return recipes.filter(recipe => {
           const title = recipe.titulo || recipe.title || '';
           const authorName = recipe.autor?.name || recipe.author?.name || '';
           const description = recipe.descripcion || '';
          
           return title.toLowerCase().includes(searchLower) ||
                  authorName.toLowerCase().includes(searchLower) ||
                  description.toLowerCase().includes(searchLower);
       });
   }
};