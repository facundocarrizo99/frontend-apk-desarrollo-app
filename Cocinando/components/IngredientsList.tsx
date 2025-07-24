import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Ingredient {
  ingrediente: string;
  cantidad: number;
  unidadMedida: string;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
  selectedComensales: number;
  setSelectedComensales: (n: number) => void;
  baseComensales: number;
}

const IngredientsList: React.FC<IngredientsListProps> = ({ ingredients, selectedComensales, setSelectedComensales, baseComensales }) => {
  const getAdjustedIngredients = () => {
    return ingredients.map(ing => ({
      ...ing,
      cantidad: Math.round((ing.cantidad * selectedComensales / baseComensales) * 100) / 100
    }));
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Ingredientes</Text>
      <View style={styles.peopleSelectorContainer}>
        <Text style={styles.peopleSelectorLabel}>Cantidad de personas:</Text>
        <View style={styles.peopleSelectorStepper}>
          <TouchableOpacity
            style={styles.peopleSelectorButton}
            onPress={() => setSelectedComensales(Math.max(1, selectedComensales - 1))}
          >
            <Ionicons name="remove-circle-outline" size={24} color="#4C5F00" />
          </TouchableOpacity>
          <Text style={styles.peopleSelectorValue}>{selectedComensales}</Text>
          <TouchableOpacity
            style={styles.peopleSelectorButton}
            onPress={() => setSelectedComensales(selectedComensales + 1)}
          >
            <Ionicons name="add-circle-outline" size={24} color="#4C5F00" />
          </TouchableOpacity>
        </View>
      </View>
      {getAdjustedIngredients().map((ingredient, index) => (
        <View key={index} style={styles.ingredientItem}>
          <View style={styles.ingredientBullet} />
          <Text style={styles.ingredientText}>
            {ingredient.cantidad} {ingredient.unidadMedida} de {ingredient.ingrediente}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4C5F00',
    marginBottom: 12,
  },
  peopleSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  peopleSelectorLabel: {
    fontSize: 15,
    color: '#4C5F00',
    fontWeight: 'bold',
    marginRight: 10,
  },
  peopleSelectorStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0E0',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 8,
  },
  peopleSelectorButton: {
    padding: 4,
  },
  peopleSelectorValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4C5F00',
    minWidth: 28,
    textAlign: 'center',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4C5F00',
    marginTop: 8,
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
  },
});

export default IngredientsList; 