import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import Header from '../components/Header';
import { UserManager } from '../utils/userManager';


const getMyRecipes = (user: any) => [
   {
       id: '1',
       title: 'Rosquitas de naranja',
       image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
       author: user.name,
       authorAvatar: user.avatar
   },
   {
       id: '2',
       title: 'Milanesas de pescado',
       image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
       author: user.name,
       authorAvatar: user.avatar
   },
   {
       id: '3',
       title: 'Arroz primavera',
       image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
       author: user.name,
       authorAvatar: user.avatar
   },
   {
       id: '4',
       title: 'Empanadas caseras',
       image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
       author: user.name,
       authorAvatar: user.avatar
   },
];


export default function PerfilScreen() {
   const user = UserManager.getCurrentUser();
  
   // Si no hay usuario logueado, redirigir al login
   if (!user) {
       router.replace('/login');
       return null;
   }


   const handleEditProfile = () => {
       router.push('/editarPerfil');
   };


   return (
       <View style={styles.container}>
           <Header />
          
           <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
                                       <Text style={styles.statText}>{user.age} años</Text>
                                   </View>
                                   <View style={styles.statItem}>
                                       <Ionicons name="flag-outline" size={16} color="#4C5F00" />
                                       <Text style={styles.statText}>{user.nationality}</Text>
                                   </View>
                                   <View style={styles.statItem}>
                                       <Ionicons name="restaurant-outline" size={16} color="#4C5F00" />
                                       <Text style={styles.statText}>{user.recipesCount} recetas</Text>
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


               {/* Lista de recetas */}
               <View style={styles.recipesContainer}>
                   {getMyRecipes(user).map((recipe) => (
                       <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
                           <ImageBackground
                               source={{ uri: recipe.image }}
                               style={styles.recipeBackground}
                               imageStyle={styles.recipeBackgroundImage}
                           >
                               {/* Header de la receta con autor */}
                               <View style={styles.recipeHeader}>
                                   <Image source={{ uri: recipe.authorAvatar }} style={styles.authorAvatar} />
                                   <Text style={styles.authorName}>{recipe.author}</Text>
                               </View>


                               {/* Footer con nombre de la receta */}
                               <View style={styles.recipeFooter}>
                                   <Text style={styles.recipeTitle}>{recipe.title}</Text>
                               </View>
                           </ImageBackground>
                       </TouchableOpacity>
                   ))}
               </View>
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
});