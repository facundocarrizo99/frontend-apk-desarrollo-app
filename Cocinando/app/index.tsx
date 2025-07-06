import { router } from 'expo-router';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function Index() {
 const handleLogin = () => {
   router.push('/login');
 };


 return (
   <View style={styles.container}>
     <StatusBar barStyle="light-content" backgroundColor="#4C5F00" />
    
     {/* Logo y título principal */}
     <View style={styles.headerContainer}>
       <Image
         source={require('../assets/images/logo.png')}
         style={styles.logo}
         resizeMode="contain"
       />
       <Text style={styles.title}>Cocinando</Text>
     </View>
    
     {/* Subtítulo */}
     <Text style={styles.subtitle}>Iniciar sesión</Text>
    
     {/* Botón de ingreso */}
     <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
       <Text style={styles.loginButtonText}>Ingresar con alias o email</Text>
     </TouchableOpacity>
   </View>
 );
}


const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#4C5F00',
   justifyContent: 'center',
   alignItems: 'center',
   padding: 20,
 },
 headerContainer: {
   alignItems: 'center',
   marginBottom: 40,
 },
 logo: {
   width: 120,
   height: 120,
   marginBottom: 20,
 },
 title: {
   fontSize: 48,
   fontWeight: 'bold',
   color: '#C4B04E',
   textAlign: 'center',
   marginBottom: 10,
 },
 subtitle: {
   fontSize: 24,
   color: 'white',
   textAlign: 'center',
   marginBottom: 50,
   fontWeight: '300',
 },
 loginButton: {
   backgroundColor: '#C4B04E',
   paddingVertical: 15,
   paddingHorizontal: 30,
   borderRadius: 30,
   elevation: 3,
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
 },
 loginButtonText: {
   color: '#4C5F00',
   fontSize: 18,
   fontWeight: 'bold',
   textAlign: 'center',
 },
});
