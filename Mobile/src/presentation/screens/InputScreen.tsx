import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const InputScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>食材登録</Text>
      <Text>食材を登録する画面</Text>
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
