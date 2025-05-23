import { View, Text, StyleSheet } from 'react-native';

export default function RecipeDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle de Receta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' }
});
