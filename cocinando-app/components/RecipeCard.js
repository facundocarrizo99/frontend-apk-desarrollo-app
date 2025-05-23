import { View, Text, Image, StyleSheet } from 'react-native';

export default function RecipeCard({ title, image }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 3
  },
  image: { width: '100%', height: 200 },
  title: { padding: 8, fontSize: 18, fontWeight: '600' }
});
