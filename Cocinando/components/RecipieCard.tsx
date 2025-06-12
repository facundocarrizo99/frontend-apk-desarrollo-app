import { View, Text, Image, StyleSheet } from 'react-native';
import { Recipe } from '../types/Recipie';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: recipe.image }} style={styles.image} />
            <Text style={styles.author}>Por: {recipe.author}</Text>
            <Text style={styles.title}>{recipe.title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 3,
    },
    image: { width: '100%', height: 150 },
    author: { paddingLeft: 10, paddingTop: 5, color: '#555' },
    title: { padding: 10, fontWeight: 'bold', fontSize: 16 },
});
