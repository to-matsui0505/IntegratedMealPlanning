import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MealPlanDetailScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>献立詳細</Text>
      <Text>献立の詳細情報を表示</Text>
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
