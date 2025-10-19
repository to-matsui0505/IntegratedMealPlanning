import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface SummaryCardProps {
  totalItems: number;
  totalCategories: number;
}

/**
 * サマリーカードコンポーネント
 * ダッシュボードの上部に表示される全体サマリー
 */
export function SummaryCard({ totalItems, totalCategories }: SummaryCardProps) {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.summaryItem}>
        <ThemedText style={styles.summaryValue}>{totalItems}</ThemedText>
        <ThemedText style={styles.summaryLabel}>合計品目数</ThemedText>
      </View>
      <View style={styles.divider} />
      <View style={styles.summaryItem}>
        <ThemedText style={styles.summaryValue}>{totalCategories}</ThemedText>
        <ThemedText style={styles.summaryLabel}>カテゴリ数</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    gap: 4,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: '#ddd',
  },
});
