import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const DashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ダッシュボード</Text>
      <Text>冷蔵庫の中身を表示</Text>
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
