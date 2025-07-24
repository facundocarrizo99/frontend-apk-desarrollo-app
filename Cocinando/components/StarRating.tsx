import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StarRatingProps {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, interactive = false, onChange, size = 16 }) => {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <TouchableOpacity
          key={i}
          onPress={() => interactive && onChange && onChange(i)}
          disabled={!interactive}
          style={interactive ? styles.interactiveStar : {}}
        >
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={size}
            color="#FFD700"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  interactiveStar: {
    padding: 4,
  },
});

export default StarRating; 