import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import Header from '../components/Header';
import { Recipe } from '../types/Recipie';
import { RecipesService } from '../utils/recipesService';
import { useAuthGuard } from '../utils/useAuthGuard';
import { UserManager } from '../utils/userManager';


export default function PerfilScreen() {
   // Proteger la ruta
   useAuthGuard();
  
   const user = UserManager.getCurrentUser();
  
   // Estados para las recetas del usuario
   const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [refreshing, setRefreshing] = useState(false);


   // El AuthGuard ya se encarga de la autenticación
   // Si llegamos aquí, el usuario está autenticado
   if (!user) {
       // Esto no debería pasar, pero por seguridad
       return null;
   }


   // Funciones helper para compatibilidad de datos (como en homeScreen)
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


   // Función para cargar las recetas del usuario
   const loadUserRecipes = async (showRefreshIndicator = false) => {
       try {
           if (showRefreshIndicator) {
               setRefreshing(true);
           } else {
               setLoading(true);
           }
           setError(null);


           const result = await RecipesService.getUserRecipes(user._id);
          
                        if (result.success && result.recipes) {
               setUserRecipes(result.recipes);
           } else {
               setError(result.error || 'Error al cargar las recetas del usuario');
               setUserRecipes([]);
           }
       } catch (err) {
           console.error('Error al cargar recetas del usuario:', err);
           setError('Error de conexión');
           setUserRecipes([]);
       } finally {
           setLoading(false);
           setRefreshing(false);
       }
   };


   // Cargar recetas cuando se monte el componente
   useEffect(() => {
       loadUserRecipes();
   }, [user._id]);


   // Handler para refresh
   const onRefresh = () => {
       loadUserRecipes(true);
   };


   const handleEditProfile = () => {
       router.push('/editarPerfil');
   };


   // Renderizar mensaje de error
   const renderError = () => (
       <View style={styles.messageContainer}>
           <Ionicons name="alert-circle-outline" size={48} color="#ff6b6b" />
           <Text style={styles.errorText}>{error}</Text>
           <TouchableOpacity style={styles.retryButton} onPress={() => loadUserRecipes()}>
               <Text style={styles.retryButtonText}>Reintentar</Text>
           </TouchableOpacity>
       </View>
   );


   // Renderizar mensaje cuando no hay recetas
   const renderEmptyState = () => (
       <View style={styles.messageContainer}>
           <Ionicons name="restaurant-outline" size={48} color="#999" />
           <Text style={styles.emptyText}>Aún no tienes recetas publicadas</Text>
           <Text style={styles.emptySubtext}>¡Comparte tu primera receta y aparecerá aquí!</Text>
       </View>
   );


   // Renderizar loading de recetas
   const renderRecipesLoading = () => (
       <View style={styles.loadingContainer}>
           <ActivityIndicator size="large" color="#C4B04E" />
           <Text style={styles.loadingText}>Cargando tus recetas...</Text>
       </View>
   );


   return (
       <View style={styles.container}>
           <Header />
          
           <ScrollView
               style={styles.content}
               showsVerticalScrollIndicator={false}
               refreshControl={
                   <RefreshControl
                       refreshing={refreshing}
                       onRefresh={onRefresh}
                       colors={['#C4B04E']}
                       tintColor="#C4B04E"
                   />
               }
           >
               {/* Card de perfil del usuario */}
               <View style={styles.profileCard}>
                   <View style={styles.profileHeader}>
                       <View style={styles.profileInfo}>
                           <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
                           <View style={styles.profileDetails}>
                               <Text style={styles.profileName}>{user.name}</Text>
                               <View style={styles.profileStats}>
                                   <View style={styles.statItem}>
                                       <Ionicons name="calendar-outline" size={16} color="#4C5F00" />
                                       <Text style={styles.statText}>{user.age || 25} años</Text>
                                   </View>
                                   <View style={styles.statItem}>
                                       <Ionicons name="flag-outline" size={16} color="#4C5F00" />
                                       <Text style={styles.statText}>{user.nationality || 'Argentina'}</Text>
                                   </View>
                                   <View style={styles.statItem}>
                                       <Ionicons name="restaurant-outline" size={16} color="#4C5F00" />
                                       <Text style={styles.statText}>{userRecipes.length} recetas</Text>
                                   </View>
                               </View>
                           </View>
                       </View>
                      
                       <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                           <Ionicons name="pencil" size={16} color="#fff" />
                           <Text style={styles.editButtonText}>Editar</Text>
                       </TouchableOpacity>
                   </View>
               </View>


               {/* Título de mis recetas */}
               <Text style={styles.sectionTitle}>Mis Recetas</Text>


               {/* Contenido dinámico de recetas */}
               {loading ? (
                   renderRecipesLoading()
               ) : error ? (
                   renderError()
               ) : userRecipes.length === 0 ? (
                   renderEmptyState()
               ) : (
                   <View style={styles.recipesContainer}>
                       {userRecipes.map((recipe) => (
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
   profileCard: {
       backgroundColor: '#C4B04E',
       borderRadius: 15,
       padding: 20,
       marginBottom: 20,
       elevation: 3,
       shadowColor: '#000',
       shadowOffset: {
           width: 0,
           height: 2,
       },
       shadowOpacity: 0.25,
       shadowRadius: 3.84,
   },
   profileHeader: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'flex-start',
   },
   profileInfo: {
       flexDirection: 'row',
       flex: 1,
   },
   profileAvatar: {
       width: 80,
       height: 80,
       borderRadius: 40,
       marginRight: 15,
       borderWidth: 3,
       borderColor: '#fff',
   },
   profileDetails: {
       flex: 1,
       justifyContent: 'center',
   },
   profileName: {
       fontSize: 22,
       fontWeight: 'bold',
       color: '#000',
       marginBottom: 10,
   },
   profileStats: {
       gap: 8,
   },
   statItem: {
       flexDirection: 'row',
       alignItems: 'center',
       marginBottom: 4,
   },
   statText: {
       fontSize: 14,
       color: '#1C1C1C',
       marginLeft: 8,
   },
   editButton: {
       backgroundColor: '#4C5F00',
       flexDirection: 'row',
       alignItems: 'center',
       paddingHorizontal: 15,
       paddingVertical: 8,
       borderRadius: 20,
       gap: 5,
   },
   editButtonText: {
       color: '#fff',
       fontSize: 14,
       fontWeight: 'bold',
   },
   sectionTitle: {
       fontSize: 20,
       fontWeight: 'bold',
       color: '#4C5F00',
       marginBottom: 15,
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
   // Nuevos estilos para los estados
   loadingContainer: {
       alignItems: 'center',
       paddingVertical: 40,
   },
   loadingText: {
       marginTop: 16,
       fontSize: 16,
       color: '#666',
   },
   messageContainer: {
       alignItems: 'center',
       paddingVertical: 40,
       paddingHorizontal: 20,
   },
   errorText: {
       marginTop: 16,
       fontSize: 16,
       color: '#ff6b6b',
       textAlign: 'center',
       marginBottom: 20,
   },
   emptyText: {
       marginTop: 16,
       fontSize: 18,
       color: '#666',
       textAlign: 'center',
       fontWeight: 'bold',
   },
   emptySubtext: {
       marginTop: 8,
       fontSize: 14,
       color: '#999',
       textAlign: 'center',
   },
   retryButton: {
       backgroundColor: '#C4B04E',
       paddingHorizontal: 20,
       paddingVertical: 10,
       borderRadius: 20,
   },
   retryButtonText: {
       color: '#fff',
       fontSize: 16,
       fontWeight: 'bold',
   },
});