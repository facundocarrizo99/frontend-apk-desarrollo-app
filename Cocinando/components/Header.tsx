import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <Ionicons name="menu" size={28} color="white" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
                <Image source={require('../assets/images/logo.png')} style={styles.logo} />
                <Text style={styles.title}>Cocinando</Text>
            </View>
            <TouchableOpacity>
                <Ionicons name="person-circle" size={28} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#4C5F00',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 30,
        height: 30,
        marginRight: 8,
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});