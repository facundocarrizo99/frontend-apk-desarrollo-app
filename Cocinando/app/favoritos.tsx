import { Ionicons } from '@expo/vector-icons';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import Header from '../components/Header';


// Lista de recetas favoritas de ejemplo
const recetasFavoritas = [
   {
       id: '1',
       title: 'Alfajores de maicena',
       image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       author: 'Juana Martinez',
       authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
   },
   {
       id: '2',
       title: 'Rosquitas de naranja',
       image: 'https://images.unsplash.com/photo-1559620192-032c4bc4866a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       author: 'Pedro Ramirez',
       authorAvatar: 'https://randomuser.me/api/portraits/men/10.jpg',
   },
   {
       id: '3',
       title: 'Torta de chocolate',
       image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       author: 'Ana López',
       authorAvatar: 'https://randomuser.me/api/portraits/women/25.jpg',
   },
   {
       id: '4',
       title: 'Empanadas caseras',
       image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       author: 'Carlos Mendez',
       authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
   },
];


export default function FavoritosScreen() {
   return (
       <View style={styles.container}>
           <Header />
          
           <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
               {/* Título de favoritos */}
               <View style={styles.titleContainer}>
                   <Ionicons name="heart" size={28} color="#4C5F00" />
                   <Text style={styles.sectionTitle}>Favoritos</Text>
               </View>


               {/* Lista de recetas favoritas */}
               <View style={styles.recipesContainer}>
                   {recetasFavoritas.map((recipe) => (
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
});