import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import ProfileForm from '../components/ProfileForm';

export default function EditarPerfil() {
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
