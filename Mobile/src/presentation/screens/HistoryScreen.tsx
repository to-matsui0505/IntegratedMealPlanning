import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const HistoryScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>履歴</Text>
      <Text>冷蔵庫の中身の増減履歴を表示</Text>
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
