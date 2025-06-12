import { View, Text, TextInput, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import BottomTabBar from '../components/BottomTabBar';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.searchBar}>
                    <TextInput placeholder="Nombre, ingrediente..." style={styles.searchInput} />
                    <TouchableOpacity style={styles.searchButton}>
                        <Text style={styles.searchButtonText}>Buscar</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Nuevas recetas</Text>

                {[
                    { title: 'Alfajores de maicena', image: require('../assets/images/react-logo.png') },
                    { title: 'Rolls de jamón y queso', image: require('../assets/images/react-logo.png') },
                    { title: 'Guiso de fideos moñito', image: require('../assets/images/react-logo.png') },
                ].map((item, index) => (
                    <View key={index} style={styles.recipeCard}>
                        <Image source={item.image} style={styles.recipeImage} />
                        <Text style={styles.recipeLabel}>{item.title}</Text>
                    </View>
                ))}
            </ScrollView>

            <BottomTabBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        padding: 16,
    },
    searchBar: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#F0F0E0',
        borderRadius: 20,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        padding: 10,
    },
    searchButton: {
        backgroundColor: '#4C5F00',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    searchButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#4C5F00',
        marginBottom: 10,
    },
    recipeCard: {
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
    },
    recipeImage: {
        width: '100%',
        height: 140,
        borderRadius: 15,
    },
    recipeLabel: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: '#C4B04EAA',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        color: '#000',
        fontWeight: 'bold',
    },
});