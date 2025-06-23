import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import Header from '../components/Header';


const allRecipes = [
   {
       id: '1',
       title: 'Alfajores de maicena',
       image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
       author: 'María González',
       authorAvatar: 'https://randomuser.me/api/portraits/women/25.jpg'
   },
   {
       id: '2',
       title: 'Rolls de jamón y queso',
       image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
       author: 'Carlos López',
       authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg'
   },
   {
       id: '3',
       title: 'Guiso de fideos moñito',
       image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
       author: 'Ana Martínez',
       authorAvatar: 'https://randomuser.me/api/portraits/women/18.jpg'
   },
   {
       id: '4',
       title: 'Empanadas caseras',
       image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
       author: 'Pedro Pérez',
       authorAvatar: 'https://randomuser.me/api/portraits/men/10.jpg'
   },
   {
       id: '5',
       title: 'Tarta de verduras',
       image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
       author: 'Laura Silva',
       authorAvatar: 'https://randomuser.me/api/portraits/women/41.jpg'
   },
   {
       id: '6',
       title: 'Pasta con salsa pomodoro',
       image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d30e?w=400&h=300&fit=crop',
       author: 'Roberto Cruz',
       authorAvatar: 'https://randomuser.me/api/portraits/men/28.jpg'
   },
   {
       id: '7',
       title: 'Ensalada mediterránea',
       image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
       author: 'Sofia Ruiz',
       authorAvatar: 'https://randomuser.me/api/portraits/women/55.jpg'
   },
   {
       id: '8',
       title: 'Pollo al horno con papas',
       image: 'https://images.unsplash.com/photo-1598514983318-74ae8ef76721?w=400&h=300&fit=crop',
       author: 'Miguel Torres',
       authorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg'
   }
];


export default function HomeScreen() {
   const [searchText, setSearchText] = useState<string>('');
   const [filteredRecipes, setFilteredRecipes] = useState(allRecipes);


   const handleSearch = () => {
       if (searchText.trim() === '') {
           setFilteredRecipes(allRecipes);
       } else {
           const filtered = allRecipes.filter(recipe =>
               recipe.title.toLowerCase().includes(searchText.toLowerCase()) ||
               recipe.author.toLowerCase().includes(searchText.toLowerCase())
           );
           setFilteredRecipes(filtered);
       }
   };


   const clearSearch = () => {
       setSearchText('');
       setFilteredRecipes(allRecipes);
   };


   return (
       <View style={styles.container}>
           <Header />


           <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
               {/* Barra de búsqueda */}
               <View style={styles.searchContainer}>
                   <View style={styles.searchBar}>
                       <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                       <TextInput
                           placeholder="Buscar recetas, autor, ingrediente..."
                           style={styles.searchInput}
                           value={searchText}
                           onChangeText={setSearchText}
                           onSubmitEditing={handleSearch}
                           returnKeyType="search"
                       />
                       {searchText.length > 0 && (
                           <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                               <Ionicons name="close-circle" size={20} color="#666" />
                           </TouchableOpacity>
                       )}
                   </View>
                   <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                       <Ionicons name="search" size={16} color="white" />
                       <Text style={styles.searchButtonText}>Buscar</Text>
                   </TouchableOpacity>
               </View>


               {/* Título de sección */}
               <View style={styles.sectionHeader}>
                   <Text style={styles.sectionTitle}>
                       {searchText ? `Resultados para "${searchText}"` : 'Nuevas recetas'}
                   </Text>
                   <Text style={styles.resultCount}>
                       {filteredRecipes.length} {filteredRecipes.length === 1 ? 'receta' : 'recetas'}
                   </Text>
               </View>


               {/* Lista de recetas */}
               {filteredRecipes.length > 0 ? (
                   <View style={styles.recipesContainer}>
                       {filteredRecipes.map((recipe) => (
                           <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
                               <ImageBackground
                                   source={{ uri: recipe.image }}
                                   style={styles.recipeBackground}
                                   imageStyle={styles.recipeBackgroundImage}
                               >
                                   {/* Footer con nombre de la receta */}
                                   <View style={styles.recipeFooter}>
                                       <Text style={styles.recipeTitle}>{recipe.title}</Text>
                                   </View>
                               </ImageBackground>
                           </TouchableOpacity>
                       ))}
                   </View>
               ) : (
                   <View style={styles.noResultsContainer}>
                       <Ionicons name="search" size={48} color="#ccc" />
                       <Text style={styles.noResultsTitle}>No se encontraron recetas</Text>
                       <Text style={styles.noResultsText}>
                           Intenta con otros términos de búsqueda
                       </Text>
                       <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
                           <Text style={styles.clearSearchText}>Ver todas las recetas</Text>
                       </TouchableOpacity>
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
   searchContainer: {
       flexDirection: 'row',
       marginBottom: 20,
       gap: 10,
   },
   searchBar: {
       flex: 1,
       flexDirection: 'row',
       backgroundColor: '#F0F0E0',
       borderRadius: 25,
       alignItems: 'center',
       paddingHorizontal: 15,
       paddingVertical: 5,
   },
   searchIcon: {
       marginRight: 10,
   },
   searchInput: {
       flex: 1,
       paddingVertical: 10,
       fontSize: 16,
       color: '#333',
   },
   clearButton: {
       marginLeft: 5,
   },
   searchButton: {
       backgroundColor: '#4C5F00',
       flexDirection: 'row',
       alignItems: 'center',
       paddingHorizontal: 15,
       paddingVertical: 10,
       borderRadius: 25,
       gap: 5,
   },
   searchButtonText: {
       color: 'white',
       fontWeight: 'bold',
       fontSize: 14,
   },
   sectionHeader: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       alignItems: 'center',
       marginBottom: 15,
   },
   sectionTitle: {
       fontWeight: 'bold',
       fontSize: 20,
       color: '#4C5F00',
   },
   resultCount: {
       fontSize: 14,
       color: '#666',
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
       justifyContent: 'flex-end',
   },
   recipeBackgroundImage: {
       borderRadius: 15,
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
   noResultsContainer: {
       alignItems: 'center',
       paddingVertical: 40,
       paddingHorizontal: 20,
   },
   noResultsTitle: {
       fontSize: 18,
       fontWeight: 'bold',
       color: '#4C5F00',
       marginTop: 15,
       marginBottom: 5,
   },
   noResultsText: {
       fontSize: 14,
       color: '#666',
       textAlign: 'center',
       marginBottom: 20,
   },
   clearSearchButton: {
       backgroundColor: '#C4B04E',
       paddingHorizontal: 20,
       paddingVertical: 10,
       borderRadius: 20,
   },
   clearSearchText: {
       color: '#000',
       fontWeight: 'bold',
   },
});
