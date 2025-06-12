import { View, FlatList, StyleSheet } from 'react-native';
import Header from '../components/Header';
import RecipeCard from '../components/RecipieCard';

const recetas = [
    {
        id: '1',
        title: 'Alfajores de maicena',
        image: 'https://via.placeholder.com/400x200.png?text=Alfajores',
        author: 'Juana',
        authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
        id: '2',
        title: 'Rosquitas de naranja',
        image: 'https://via.placeholder.com/400x200.png?text=Rosquitas',
        author: 'Pedro',
        authorAvatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    },
];

export default function FavoritosScreen() {
    return (
        <View style={styles.container}>
            <Header />
            <FlatList
                data={recetas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <RecipeCard recipe={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
});
