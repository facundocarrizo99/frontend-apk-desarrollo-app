import { View, FlatList, StyleSheet } from 'react-native';
import Header from '../components/Header';
import RecipeCard from '../components/RecipieCard';

const user = {
    name: 'Pedro Perez',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
    age: 28,
    nationality: 'Argentino',
    recipesCount: 10,
};

const myRecipes = [
    { id: '1', title: 'Rosquitas de naranja', image: '...', author: 'Pedro', authorAvatar: user.avatar },
    { id: '2', title: 'Milanesas de pescado', image: '...', author: 'Pedro', authorAvatar: user.avatar },
    { id: '3', title: 'Arroz primavera', image: '...', author: 'Pedro', authorAvatar: user.avatar },
];

export default function PerfilScreen() {
    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.profileCard}>
                {/* Aquí puedes mostrar la info del perfil */}
            </View>
            <FlatList
                data={myRecipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <RecipeCard recipe={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    profileCard: { margin: 10 },
});
