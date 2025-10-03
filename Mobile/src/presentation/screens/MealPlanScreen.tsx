import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MealPlanScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>献立作成</Text>
      <Text>AIが献立を提案する画面</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
