import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import Header from '../components/Header';
import { Recipe } from '../types/Recipie';
import { useAuthGuard } from '../utils/useAuthGuard';
import { useFavorites } from '../utils/useFavorites';






export default function FavoritosScreen() {
   // Proteger la ruta
   useAuthGuard();


   // Hook para manejar favoritos
   const { favorites, loading, error, toggleFavorite, isFavorite } = useFavorites();


   // Funciones helper para compatibilidad de datos
   const getRecipeTitle = (recipe: Recipe): string => {
       return recipe.titulo || recipe.title || 'Sin título';
   };


   const getRecipeImage = (recipe: Recipe): string => {
       return recipe.imagen || recipe.image || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=300&fit=crop';
   };


   const getAuthorName = (recipe: Recipe): string => {
       return recipe.autor?.name || recipe.author?.name || 'Autor desconocido';
   };


   const getAuthorAvatar = (recipe: Recipe): string => {
       return recipe.autor?.avatar || recipe.author?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg';
   };


   // Función para navegar al detalle de la receta
   const handleRecipePress = (recipe: Recipe) => {
       router.push({
           pathname: '/recipeDetail',
           params: {
               id: recipe._id,
               titulo: getRecipeTitle(recipe),
               descripcion: recipe.descripcion || '',
               imagen: getRecipeImage(recipe),
               autor: JSON.stringify(recipe.autor),
               ingredientes: recipe.ingredientes ? JSON.stringify(recipe.ingredientes) : '[]',
               pasos: recipe.pasos ? JSON.stringify(recipe.pasos) : '[]',
               cantidadComensales: recipe.cantidadComensales?.toString() || '1',
               tags: recipe.tags ? JSON.stringify(recipe.tags) : '[]',
               valoracionPromedio: recipe.valoracionPromedio?.toString() || '0',
               fechaCreacion: recipe.fechaCreacion || '',
               fechaModificacion: recipe.fechaModificacion || '',
           },
       });
   };


   // Función para manejar el toggle de favoritos
   const handleFavoritePress = async (recipe: Recipe, event: any) => {
       // Evitar que se ejecute el onPress de la receta
       event.stopPropagation();
      
       const newFavoriteStatus = await toggleFavorite(recipe._id);
      
       if (error) {
           Alert.alert(
               'Error',
               error,
               [{ text: 'OK' }]
           );
       }
   };
  
   return (
       <View style={styles.container}>
           <Header />
          
           <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
               {/* Título de favoritos */}
               <View style={styles.titleContainer}>
                   <Ionicons name="heart" size={28} color="#4C5F00" />
                   <Text style={styles.sectionTitle}>Favoritos</Text>
               </View>


               {/* Estados de carga, error y contenido */}
               {loading ? (
                   <View style={styles.loadingContainer}>
                       <ActivityIndicator size="large" color="#4C5F00" />
                       <Text style={styles.loadingText}>Cargando favoritos...</Text>
                   </View>
               ) : error ? (
                   <View style={styles.errorContainer}>
                       <Ionicons name="alert-circle-outline" size={48} color="#d32f2f" />
                       <Text style={styles.errorText}>{error}</Text>
                   </View>
               ) : favorites.length === 0 ? (
                   <View style={styles.emptyContainer}>
                       <Ionicons name="heart-outline" size={64} color="#ccc" />
                       <Text style={styles.emptyTitle}>No tienes favoritos aún</Text>
                       <Text style={styles.emptyText}>
                           Agrega recetas a tus favoritos tocando el corazón en las recetas que más te gusten
                       </Text>
                   </View>
               ) : (
                   <View style={styles.recipesContainer}>
                       {favorites.map((recipe) => (
                           <TouchableOpacity
                               key={recipe._id}
                               style={styles.recipeCard}
                               onPress={() => handleRecipePress(recipe)}
                           >
                               <ImageBackground
                                   source={{ uri: getRecipeImage(recipe) }}
                                   style={styles.recipeBackground}
                                   imageStyle={styles.recipeBackgroundImage}
                               >
                                   {/* Botón de favoritos */}
                                   <TouchableOpacity
                                       style={styles.favoriteButton}
                                       onPress={(event) => handleFavoritePress(recipe, event)}
                                   >
                                       <Ionicons
                                           name="heart"
                                           size={24}
                                           color="#FF6B6B"
                                       />
                                   </TouchableOpacity>


                                   {/* Header de la receta con autor */}
                                   <View style={styles.recipeHeader}>
                                       <Image source={{ uri: getAuthorAvatar(recipe) }} style={styles.authorAvatar} />
                                       <Text style={styles.authorName}>{getAuthorName(recipe)}</Text>
                                   </View>


                                   {/* Footer con nombre de la receta */}
                                   <View style={styles.recipeFooter}>
                                       <Text style={styles.recipeTitle}>{getRecipeTitle(recipe)}</Text>
                                   </View>
                               </ImageBackground>
                           </TouchableOpacity>
                       ))}
                   </View>
               )}
           </ScrollView>


           <BottomTabBar />
       </View>
   );
}


const styles = StyleSheet.create({
   container: {
       flex: 1,
       backgroundColor: '#fff',
   },
   content: {
       flex: 1,
       padding: 15,
   },
   titleContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       marginBottom: 20,
       gap: 10,
   },
   sectionTitle: {
       fontSize: 20,
       fontWeight: 'bold',
       color: '#4C5F00',
   },
   recipesContainer: {
       gap: 15,
       paddingBottom: 20,
   },
   recipeCard: {
       borderRadius: 15,
       overflow: 'hidden',
       elevation: 5,
       shadowColor: '#000',
       shadowOffset: {
           width: 0,
           height: 2,
       },
       shadowOpacity: 0.25,
       shadowRadius: 3.84,
   },
   recipeBackground: {
       width: '100%',
       height: 200,
       justifyContent: 'space-between',
   },
   recipeBackgroundImage: {
       borderRadius: 15,
   },
   recipeHeader: {
       flexDirection: 'row',
       alignItems: 'center',
       padding: 15,
       backgroundColor: 'rgba(0, 0, 0, 0.3)',
       borderTopLeftRadius: 15,
       borderTopRightRadius: 15,
   },
   authorAvatar: {
       width: 30,
       height: 30,
       borderRadius: 15,
       marginRight: 10,
       borderWidth: 2,
       borderColor: '#fff',
   },
   authorName: {
       color: '#fff',
       fontSize: 14,
       fontWeight: 'bold',
       textShadowColor: 'rgba(0, 0, 0, 0.75)',
       textShadowOffset: { width: 1, height: 1 },
       textShadowRadius: 2,
   },
   recipeFooter: {
       backgroundColor: 'rgba(0, 0, 0, 0.6)',
       padding: 15,
       borderBottomLeftRadius: 15,
       borderBottomRightRadius: 15,
   },
   recipeTitle: {
       color: '#fff',
       fontSize: 16,
       fontWeight: 'bold',
       textShadowColor: 'rgba(0, 0, 0, 0.75)',
       textShadowOffset: { width: 1, height: 1 },
       textShadowRadius: 2,
   },
   loadingContainer: {
       alignItems: 'center',
       paddingVertical: 40,
   },
   loadingText: {
       marginTop: 16,
       fontSize: 16,
       color: '#666',
   },
   errorContainer: {
       alignItems: 'center',
       paddingVertical: 40,
       paddingHorizontal: 20,
   },
   errorText: {
       marginTop: 16,
       fontSize: 16,
       color: '#d32f2f',
       textAlign: 'center',
   },
   emptyContainer: {
       alignItems: 'center',
       paddingVertical: 60,
       paddingHorizontal: 20,
   },
   emptyTitle: {
       fontSize: 20,
       fontWeight: 'bold',
       color: '#4C5F00',
       marginTop: 20,
       marginBottom: 10,
   },
   emptyText: {
       fontSize: 16,
       color: '#666',
       textAlign: 'center',
       lineHeight: 22,
   },
   favoriteButton: {
       position: 'absolute',
       top: 15,
       right: 15,
       backgroundColor: 'rgba(0, 0, 0, 0.5)',
       borderRadius: 20,
       padding: 8,
       zIndex: 1,
   },
});