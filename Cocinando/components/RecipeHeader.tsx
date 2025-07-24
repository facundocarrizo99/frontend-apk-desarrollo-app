import React from 'react';
import { ImageBackground, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecipeHeaderProps {
  image: string;
  onBack: () => void;
  onEdit: () => void;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({ image, onBack, onEdit }) => (
  <View style={styles.imageContainer}>
    <ImageBackground 
      source={{ uri: image }} 
      style={styles.heroImage}
      imageStyle={styles.heroImageStyle}
    >
      <View style={styles.imageOverlay}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Ionicons name="pencil" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 300,
    justifyContent: 'flex-start',
  },
  heroImageStyle: {
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

export default RecipeHeader; 