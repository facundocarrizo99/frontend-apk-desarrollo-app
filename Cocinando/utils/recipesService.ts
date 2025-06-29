import { Recipe, RecipesApiResponse } from '../types/Recipie';
import { APP_CONFIG, devLog } from './config';
import { UserManager } from './userManager';


// Recetas de ejemplo para fallback
const fallbackRecipes: Recipe[] = [
   {
       _id: '1',
       id: '1',
       title: 'Milanesas de pollo crujientes',
       description: 'Deliciosas milanesas de pollo con una cobertura extra crujiente',
       image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       author: {
           _id: '1',
           name: 'María González',
           avatar: 'https://randomuser.me/api/portraits/women/15.jpg'
       },
       createdAt: '2024-01-15T10:00:00.000Z',
       updatedAt: '2024-01-15T10:00:00.000Z',
       approved: true
   },
   {
       _id: '2',
       id: '2',
       title: 'Pasta con salsa de tomates frescos',
       description: 'Una pasta simple pero deliciosa con tomates frescos del huerto',
       image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       author: {
           _id: '2',
           name: 'Roberto Silva',
           avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
       },
       createdAt: '2024-01-14T15:30:00.000Z',
       updatedAt: '2024-01-14T15:30:00.000Z',
       approved: true
   },
   {
       _id: '3',
       id: '3',
       title: 'Ensalada mediterránea',
       description: 'Ensalada fresca con aceitunas, queso feta y vegetales de temporada',
       image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       author: {
           _id: '3',
           name: 'Laura Fernández',
           avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
       },
       createdAt: '2024-01-13T12:15:00.000Z',
       updatedAt: '2024-01-13T12:15:00.000Z',
       approved: true
   },
   {
       _id: '4',
       id: '4',
       title: 'Brownies de chocolate',
       description: 'Brownies húmedos y chocolatosos, perfectos para los amantes del chocolate',
       image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       author: {
           _id: '4',
           name: 'Diego Morales',
           avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
       },
       createdAt: '2024-01-12T09:45:00.000Z',
       updatedAt: '2024-01-12T09:45:00.000Z',
       approved: true
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


   // Buscar recetas por texto
   searchRecipes: (recipes: Recipe[], searchText: string): Recipe[] => {
       if (!searchText.trim()) {
           return recipes;
       }


       const searchLower = searchText.toLowerCase();
      
       return recipes.filter(recipe =>
           recipe.title.toLowerCase().includes(searchLower) ||
           recipe.author.name.toLowerCase().includes(searchLower) ||
           recipe.description?.toLowerCase().includes(searchLower)
       );
   }
};