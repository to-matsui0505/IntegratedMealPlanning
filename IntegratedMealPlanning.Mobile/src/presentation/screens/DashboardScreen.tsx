import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { FridgeItem } from '@/src/domain/entities/FridgeItem';
import { diContainer } from '@/src/infrastructure/di/DIContainer';

/**
 * ダッシュボード画面
 * 現在の冷蔵庫の中身を一覧表示する
 */
export default function DashboardScreen() {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const useCase = diContainer.getGetCurrentItemsUseCase();
      const fridgeItems = await useCase.execute();
      setItems(fridgeItems);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: FridgeItem }) => (
    <ThemedView style={styles.itemCard}>
      <ThemedText type="subtitle">{item.name}</ThemedText>
      <View style={styles.itemDetails}>
        <ThemedText>
          分類: {item.category} / {item.subCategory}
        </ThemedText>
        <ThemedText>
          数量: {item.quantity} {item.unit}
        </ThemedText>
        <ThemedText>更新日: {item.updatedAt.toLocaleDateString('ja-JP')}</ThemedText>
      </View>
    </ThemedView>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.errorText}>
          エラー: {error}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        冷蔵庫の中身
      </ThemedText>
      {items.length === 0 ? (
        <ThemedText style={styles.emptyText}>冷蔵庫にアイテムがありません</ThemedText>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  list: {
    gap: 12,
  },
  itemCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemDetails: {
    marginTop: 8,
    gap: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
