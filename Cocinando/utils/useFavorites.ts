import { useEffect, useState } from 'react';
import { Recipe } from '../types/Recipie';
import { FavoritesService } from './favoritesService';


export const useFavorites = () => {
   const [favorites, setFavorites] = useState<Recipe[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);


   // Cargar favoritos al inicializar
   useEffect(() => {
       loadFavorites();
   }, []);


   const loadFavorites = async () => {
       try {
           setLoading(true);
           setError(null);
          
           const result = await FavoritesService.getFavorites();
          
           if (result.success) {
               setFavorites(result.recipes || []);
           } else {
               setError(result.error || 'Error al cargar favoritos');
           }
       } catch (err) {
           setError('Error de conexión al cargar favoritos');
       } finally {
           setLoading(false);
       }
   };


   const toggleFavorite = async (recipeId: string): Promise<boolean> => {
       try {
           const isFavorite = favorites.some(recipe => recipe._id === recipeId);
          
           if (isFavorite) {
               const result = await FavoritesService.removeFromFavorites(recipeId);
               if (result.success) {
                   setFavorites(prev => prev.filter(recipe => recipe._id !== recipeId));
                   return false;
               } else {
                   setError(result.error || 'Error al remover de favoritos');
                   return true;
               }
           } else {
               const result = await FavoritesService.addToFavorites(recipeId);
               if (result.success) {
                   // Recargar favoritos para obtener la receta completa
                   await loadFavorites();
                   return true;
               } else {
                   setError(result.error || 'Error al agregar a favoritos');
                   return false;
               }
           }
       } catch (err) {
           setError('Error de conexión al actualizar favoritos');
           return false;
       }
   };


   const isFavorite = (recipeId: string): boolean => {
       return favorites.some(recipe => recipe._id === recipeId);
   };


   return {
       favorites,
       loading,
       error,
       toggleFavorite,
       isFavorite,
       loadFavorites
   };
};