import { View, Text, StyleSheet } from 'react-native';

export default function AddRecipeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Receta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' }
});
