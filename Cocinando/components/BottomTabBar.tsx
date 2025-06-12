import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomTabBar() {
    return (
        <View style={styles.container}>
            <Tab icon="home" label="Inicio" />
            <Tab icon="search" label="Buscar" />
            <Tab icon="add" label="Añadir" />
            <Tab icon="heart" label="Favoritos" />
            <Tab icon="person" label="Mi perfil" />
        </View>
    );
}

function Tab({ icon, label }: { icon: any; label: string }) {
    return (
        <TouchableOpacity style={styles.tab}>
            <Ionicons name={icon} size={20} color="#4C5F00" />
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F8F8DC',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    tab: {
        alignItems: 'center',
    },
    label: {
        fontSize: 10,
        color: '#4C5F00',
    },
});