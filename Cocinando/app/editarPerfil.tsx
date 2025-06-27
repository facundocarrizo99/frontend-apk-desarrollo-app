import { StyleSheet, View } from 'react-native';
import Header from '../components/Header';
import ProfileForm from '../components/ProfileForm';
import { useAuthGuard } from '../utils/useAuthGuard';


export default function EditarPerfil() {
   // Proteger la ruta
   useAuthGuard();
  
   return (
       <View style={styles.container}>
           <Header />
           <ProfileForm />
       </View>
   );
}


const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#fff' },
});