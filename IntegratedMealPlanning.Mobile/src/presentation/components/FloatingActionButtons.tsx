import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface FloatingActionButtonsProps {
  onAddItem: () => void;
  onCreateMealPlan: () => void;
}

/**
 * フローティングアクションボタンコンポーネント
 * 画面右下に固定表示されるアクションボタン
 */
export function FloatingActionButtons({
  onAddItem,
  onCreateMealPlan,
}: FloatingActionButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={onCreateMealPlan}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.buttonText}>📅</ThemedText>
        <ThemedText style={styles.buttonLabel}>献立作成</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.primaryButton]}
        onPress={onAddItem}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.buttonText}>➕</ThemedText>
        <ThemedText style={styles.buttonLabel}>食材追加</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    gap: 12,
    zIndex: 1000,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    fontSize: 20,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
