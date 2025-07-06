import React from 'react';
import {
   View,
   Text,
   StyleSheet,
   ScrollView,
   Image,
   TouchableOpacity,
   ImageBackground,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import BottomTabBar from '../components/BottomTabBar';
import { Recipe } from '../types/Recipie';


export default function RecipeDetail() {
   // Obtener los parámetros de la receta
   const params = useLocalSearchParams();
  
   // Reconstruir el objeto recipe desde los parámetros
   const recipe: Recipe = {
       _id: params.id as string,
       titulo: params.titulo as string,
       descripcion: params.descripcion as string,
       imagen: params.imagen as string,
       autor: JSON.parse(params.autor as string),
       ingredientes: params.ingredientes ? JSON.parse(params.ingredientes as string) : [],
       pasos: params.pasos ? JSON.parse(params.pasos as string) : [],
       cantidadComensales: params.cantidadComensales ? parseInt(params.cantidadComensales as string) : 1,
       tags: params.tags ? JSON.parse(params.tags as string) : [],
       aprobado: true,
       valoracionPromedio: params.valoracionPromedio ? parseFloat(params.valoracionPromedio as string) : 0,
       fechaCreacion: params.fechaCreacion as string,
       fechaModificacion: params.fechaModificacion as string,
   };


   const handleBack = () => {
       router.back();
   };


   // Función para obtener el avatar del autor con fallback
   const getAuthorAvatar = (): string => {
       return recipe.autor?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg';
   };


   // Función para obtener el nombre del autor con fallback
   const getAuthorName = (): string => {
       return recipe.autor?.name || 'Autor desconocido';
   };


   return (
       <View style={styles.container}>
           <Header />
          
           <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
               {/* Imagen principal de la receta */}
               <View style={styles.imageContainer}>
                   <ImageBackground
                       source={{ uri: recipe.imagen }}
                       style={styles.heroImage}
                       imageStyle={styles.heroImageStyle}
                   >
                       <View style={styles.imageOverlay}>
                           <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                               <Ionicons name="arrow-back" size={24} color="white" />
                           </TouchableOpacity>
                       </View>
                   </ImageBackground>
               </View>


               {/* Información principal */}
               <View style={styles.mainInfo}>
                   <Text style={styles.recipeTitle}>{recipe.titulo}</Text>
                  
                   {/* Información del autor */}
                   <View style={styles.authorSection}>
                       <Image
                           source={{ uri: getAuthorAvatar() }}
                           style={styles.authorAvatar}
                       />
                       <View style={styles.authorDetails}>
                           <Text style={styles.authorLabel}>Creado por</Text>
                           <Text style={styles.authorName}>{getAuthorName()}</Text>
                       </View>
                   </View>


                   {/* Estadísticas */}
                   <View style={styles.statsContainer}>
                       {recipe.cantidadComensales && (
                           <View style={styles.statItem}>
                               <Ionicons name="people" size={20} color="#4C5F00" />
                               <Text style={styles.statText}>{recipe.cantidadComensales} comensales</Text>
                           </View>
                       )}
                       {recipe.valoracionPromedio && recipe.valoracionPromedio > 0 && (
                           <View style={styles.statItem}>
                               <Ionicons name="star" size={20} color="#FFD700" />
                               <Text style={styles.statText}>{recipe.valoracionPromedio.toFixed(1)}</Text>
                           </View>
                       )}
                   </View>


                   {/* Descripción */}
                   {recipe.descripcion && (
                       <View style={styles.section}>
                           <Text style={styles.sectionTitle}>Descripción</Text>
                           <Text style={styles.description}>{recipe.descripcion}</Text>
                       </View>
                   )}


                   {/* Tags */}
                   {recipe.tags && recipe.tags.length > 0 && (
                       <View style={styles.section}>
                           <Text style={styles.sectionTitle}>Etiquetas</Text>
                           <View style={styles.tagsContainer}>
                               {recipe.tags.map((tag, index) => (
                                   <View key={index} style={styles.tag}>
                                       <Text style={styles.tagText}>{tag}</Text>
                                   </View>
                               ))}
                           </View>
                       </View>
                   )}


                   {/* Ingredientes */}
                   {recipe.ingredientes && recipe.ingredientes.length > 0 && (
                       <View style={styles.section}>
                           <Text style={styles.sectionTitle}>Ingredientes</Text>
                           {recipe.ingredientes.map((ingredient, index) => (
                               <View key={index} style={styles.ingredientItem}>
                                   <View style={styles.ingredientBullet} />
                                   <Text style={styles.ingredientText}>
                                       {ingredient.cantidad} {ingredient.unidadMedida} de {ingredient.ingrediente}
                                   </Text>
                               </View>
                           ))}
                       </View>
                   )}


                   {/* Pasos */}
                   {recipe.pasos && recipe.pasos.length > 0 && (
                       <View style={styles.section}>
                           <Text style={styles.sectionTitle}>Preparación</Text>
                           {recipe.pasos.map((step, index) => (
                               <View key={index} style={styles.stepItem}>
                                   <View style={styles.stepNumber}>
                                       <Text style={styles.stepNumberText}>{index + 1}</Text>
                                   </View>
                                   <Text style={styles.stepText}>{step}</Text>
                               </View>
                           ))}
                       </View>
                   )}
               </View>
           </ScrollView>


           <BottomTabBar />
       </View>
   );
}


const styles = StyleSheet.create({
   container: {
       flex: 1,
       backgroundColor: '#f5f5f5',
   },
   content: {
       flex: 1,
   },
   imageContainer: {
       position: 'relative',
   },
   heroImage: {
       width: '100%',
       height: 300,
       justifyContent: 'flex-start',
   },
   heroImageStyle: {
       resizeMode: 'cover',
   },
   imageOverlay: {
       position: 'absolute',
       top: 0,
       left: 0,
       right: 0,
       height: 80,
       backgroundColor: 'rgba(0,0,0,0.3)',
       paddingTop: 20,
       paddingHorizontal: 16,
   },
   backButton: {
       width: 40,
       height: 40,
       borderRadius: 20,
       backgroundColor: 'rgba(0,0,0,0.5)',
       justifyContent: 'center',
       alignItems: 'center',
   },
   mainInfo: {
       backgroundColor: 'white',
       borderTopLeftRadius: 20,
       borderTopRightRadius: 20,
       marginTop: -20,
       paddingTop: 24,
       paddingHorizontal: 20,
       paddingBottom: 20,
   },
   recipeTitle: {
       fontSize: 28,
       fontWeight: 'bold',
       color: '#333',
       marginBottom: 16,
       lineHeight: 34,
   },
   authorSection: {
       flexDirection: 'row',
       alignItems: 'center',
       marginBottom: 20,
       paddingBottom: 20,
       borderBottomWidth: 1,
       borderBottomColor: '#f0f0f0',
   },
   authorAvatar: {
       width: 50,
       height: 50,
       borderRadius: 25,
       marginRight: 12,
   },
   authorDetails: {
       flex: 1,
   },
   authorLabel: {
       fontSize: 14,
       color: '#666',
       marginBottom: 2,
   },
   authorName: {
       fontSize: 16,
       fontWeight: '600',
       color: '#333',
   },
   statsContainer: {
       flexDirection: 'row',
       flexWrap: 'wrap',
       marginBottom: 24,
   },
   statItem: {
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: '#f8f9fa',
       paddingHorizontal: 12,
       paddingVertical: 8,
       borderRadius: 20,
       marginRight: 12,
       marginBottom: 8,
   },
   statText: {
       marginLeft: 6,
       fontSize: 14,
       color: '#666',
       fontWeight: '500',
   },
   section: {
       marginBottom: 24,
   },
   sectionTitle: {
       fontSize: 20,
       fontWeight: 'bold',
       color: '#4C5F00',
       marginBottom: 12,
   },
   description: {
       fontSize: 16,
       lineHeight: 24,
       color: '#555',
   },
   tagsContainer: {
       flexDirection: 'row',
       flexWrap: 'wrap',
   },
   tag: {
       backgroundColor: '#E8F5E8',
       paddingHorizontal: 12,
       paddingVertical: 6,
       borderRadius: 16,
       marginRight: 8,
       marginBottom: 8,
   },
   tagText: {
       fontSize: 14,
       color: '#4C5F00',
       fontWeight: '500',
   },
   ingredientItem: {
       flexDirection: 'row',
       alignItems: 'flex-start',
       marginBottom: 10,
   },
   ingredientBullet: {
       width: 6,
       height: 6,
       borderRadius: 3,
       backgroundColor: '#4C5F00',
       marginTop: 8,
       marginRight: 12,
   },
   ingredientText: {
       flex: 1,
       fontSize: 16,
       lineHeight: 22,
       color: '#555',
   },
   stepItem: {
       flexDirection: 'row',
       alignItems: 'flex-start',
       marginBottom: 16,
   },
   stepNumber: {
       width: 28,
       height: 28,
       borderRadius: 14,
       backgroundColor: '#4C5F00',
       justifyContent: 'center',
       alignItems: 'center',
       marginRight: 12,
       marginTop: 2,
   },
   stepNumberText: {
       color: 'white',
       fontSize: 14,
       fontWeight: 'bold',
   },
   stepText: {
       flex: 1,
       fontSize: 16,
       lineHeight: 24,
       color: '#555',
   },
});