import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StepsListProps {
  steps: string[];
}

const StepsList: React.FC<StepsListProps> = ({ steps }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Preparación</Text>
    {steps.map((step, index) => (
      <View key={index} style={styles.stepItem}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>{index + 1}</Text>
        </View>
        <Text style={styles.stepText}>{step}</Text>
      </View>
    ))}
  </View>
);

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
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4C5F00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});

export default StepsList; 