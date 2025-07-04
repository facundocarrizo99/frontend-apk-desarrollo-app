import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import Header from '../components/Header';
import { useAuthGuard } from '../utils/useAuthGuard';


// Lista de recetas favoritas de ejemplo (estructura compatible con Recipe)
const recetasFavoritas = [
   {
       _id: '1',
       titulo: 'Alfajores de maicena',
       descripcion: 'Deliciosos alfajores caseros con dulce de leche y coco rallado. Una receta tradicional argentina que conquista paladares.',
       imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       autor: {
           _id: 'user1',
           name: 'Juana Martinez',
           email: 'juana@email.com',
           avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
           role: 'alumno' as const,
           createdAt: '2024-01-15T10:00:00Z',
           updatedAt: '2024-01-15T10:00:00Z',
           __v: 0,
           id: 'user1'
       },
       ingredientes: [
           { _id: 'ing1', ingrediente: 'Harina', cantidad: 200, unidadMedida: 'gramos' },
           { _id: 'ing2', ingrediente: 'Maicena', cantidad: 100, unidadMedida: 'gramos' },
           { _id: 'ing3', ingrediente: 'Manteca', cantidad: 100, unidadMedida: 'gramos' },
           { _id: 'ing4', ingrediente: 'Dulce de leche', cantidad: 300, unidadMedida: 'gramos' },
           { _id: 'ing5', ingrediente: 'Coco rallado', cantidad: 100, unidadMedida: 'gramos' }
       ],
       pasos: [
           'Mezclar la harina con la maicena en un bowl.',
           'Agregar la manteca pomada y mezclar hasta formar una masa.',
           'Estirar la masa y cortar círculos del tamaño deseado.',
           'Hornear a 180°C por 12-15 minutos hasta que estén dorados.',
           'Dejar enfriar completamente.',
           'Rellenar con dulce de leche y pasar por coco rallado.'
       ],
       cantidadComensales: 12,
       tags: ['postre', 'tradicional', 'argentina'],
       valoracionPromedio: 4.8,
       fechaCreacion: '2024-01-15T10:00:00Z',
       fechaModificacion: '2024-01-15T10:00:00Z'
   },
   {
       _id: '2',
       titulo: 'Rosquitas de naranja',
       descripcion: 'Suaves rosquitas con el aroma y sabor cítrico de la naranja. Perfectas para acompañar el mate o el té.',
       imagen: 'https://images.unsplash.com/photo-1559620192-032c4bc4866a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       autor: {
           _id: 'user2',
           name: 'Pedro Ramirez',
           email: 'pedro@email.com',
           avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
           role: 'alumno' as const,
           createdAt: '2024-01-16T11:00:00Z',
           updatedAt: '2024-01-16T11:00:00Z',
           __v: 0,
           id: 'user2'
       },
       ingredientes: [
           { _id: 'ing6', ingrediente: 'Harina', cantidad: 300, unidadMedida: 'gramos' },
           { _id: 'ing7', ingrediente: 'Azúcar', cantidad: 150, unidadMedida: 'gramos' },
           { _id: 'ing8', ingrediente: 'Huevos', cantidad: 2, unidadMedida: 'unidades' },
           { _id: 'ing9', ingrediente: 'Jugo de naranja', cantidad: 100, unidadMedida: 'ml' },
           { _id: 'ing10', ingrediente: 'Ralladura de naranja', cantidad: 1, unidadMedida: 'cucharada' }
       ],
       pasos: [
           'Batir los huevos con el azúcar hasta que blanqueen.',
           'Agregar el jugo y ralladura de naranja.',
           'Incorporar la harina de a poco hasta formar una masa.',
           'Formar rosquitas y colocar en placa enmantecada.',
           'Hornear a 180°C por 15-20 minutos hasta dorar.'
       ],
       cantidadComensales: 20,
       tags: ['merienda', 'naranja', 'casero'],
       valoracionPromedio: 4.5,
       fechaCreacion: '2024-01-16T11:00:00Z',
       fechaModificacion: '2024-01-16T11:00:00Z'
   },
   {
       _id: '3',
       titulo: 'Torta de chocolate',
       descripcion: 'Una irresistible torta de chocolate húmeda y esponjosa, cubierta con ganache de chocolate. El sueño de todo amante del chocolate.',
       imagen: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       autor: {
           _id: 'user3',
           name: 'Ana López',
           email: 'ana@email.com',
           avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
           role: 'alumno' as const,
           createdAt: '2024-01-17T12:00:00Z',
           updatedAt: '2024-01-17T12:00:00Z',
           __v: 0,
           id: 'user3'
       },
       ingredientes: [
           { _id: 'ing11', ingrediente: 'Harina', cantidad: 200, unidadMedida: 'gramos' },
           { _id: 'ing12', ingrediente: 'Cacao en polvo', cantidad: 50, unidadMedida: 'gramos' },
           { _id: 'ing13', ingrediente: 'Azúcar', cantidad: 200, unidadMedida: 'gramos' },
           { _id: 'ing14', ingrediente: 'Huevos', cantidad: 3, unidadMedida: 'unidades' },
           { _id: 'ing15', ingrediente: 'Chocolate', cantidad: 200, unidadMedida: 'gramos' }
       ],
       pasos: [
           'Derretir el chocolate a baño maría.',
           'Batir huevos con azúcar hasta punto letra.',
           'Agregar el chocolate derretido tibio.',
           'Incorporar harina y cacao tamizados.',
           'Hornear en molde enmantecado a 180°C por 35 minutos.',
           'Cubrir con ganache una vez frío.'
       ],
       cantidadComensales: 8,
       tags: ['postre', 'chocolate', 'cumpleaños'],
       valoracionPromedio: 4.9,
       fechaCreacion: '2024-01-17T12:00:00Z',
       fechaModificacion: '2024-01-17T12:00:00Z'
   },
   {
       _id: '4',
       titulo: 'Empanadas caseras',
       descripcion: 'Empanadas tradicionales argentinas rellenas de carne cortada a cuchillo. Una receta familiar que pasa de generación en generación.',
       imagen: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
       autor: {
           _id: 'user4',
           name: 'Carlos Mendez',
           email: 'carlos@email.com',
           avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
           role: 'alumno' as const,
           createdAt: '2024-01-18T13:00:00Z',
           updatedAt: '2024-01-18T13:00:00Z',
           __v: 0,
           id: 'user4'
       },
       ingredientes: [
           { _id: 'ing16', ingrediente: 'Masa para empanadas', cantidad: 12, unidadMedida: 'unidades' },
           { _id: 'ing17', ingrediente: 'Carne picada', cantidad: 500, unidadMedida: 'gramos' },
           { _id: 'ing18', ingrediente: 'Cebolla', cantidad: 2, unidadMedida: 'unidades' },
           { _id: 'ing19', ingrediente: 'Huevos duros', cantidad: 2, unidadMedida: 'unidades' },
           { _id: 'ing20', ingrediente: 'Aceitunas', cantidad: 12, unidadMedida: 'unidades' }
       ],
       pasos: [
           'Rehogar la cebolla picada hasta que esté transparente.',
           'Agregar la carne y cocinar hasta que se dore.',
           'Condimentar con sal, pimienta y comino.',
           'Dejar enfriar y agregar huevo duro picado y aceitunas.',
           'Rellenar las tapas y cerrar con repulgue.',
           'Hornear a 200°C por 20-25 minutos hasta dorar.'
       ],
       cantidadComensales: 6,
       tags: ['salado', 'tradicional', 'almuerzo'],
       valoracionPromedio: 4.7,
       fechaCreacion: '2024-01-18T13:00:00Z',
       fechaModificacion: '2024-01-18T13:00:00Z'
   },
];


export default function FavoritosScreen() {
   // Proteger la ruta
   useAuthGuard();


   // Funciones helper para compatibilidad de datos
   const getRecipeTitle = (recipe: any): string => {
       return recipe.titulo || recipe.title || 'Sin título';
   };


   const getRecipeImage = (recipe: any): string => {
       return recipe.imagen || recipe.image || 'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=300&fit=crop';
   };


   const getAuthorName = (recipe: any): string => {
       return recipe.autor?.name || recipe.author || 'Autor desconocido';
   };


   const getAuthorAvatar = (recipe: any): string => {
       return recipe.autor?.avatar || recipe.authorAvatar || 'https://randomuser.me/api/portraits/men/1.jpg';
   };


   // Función para navegar al detalle de la receta
   const handleRecipePress = (recipe: any) => {
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