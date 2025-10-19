import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { HistoryRecord } from '@/src/domain/entities/HistoryRecord';
import { diContainer } from '@/src/infrastructure/di/DIContainer';

/**
 * 履歴画面
 * 冷蔵庫の増減履歴を表示する
 */
export default function HistoryScreen() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const useCase = diContainer.getGetHistoryUseCase();
      const historyRecords = await useCase.execute();
      setRecords(historyRecords);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: HistoryRecord }) => (
    <ThemedView style={styles.recordCard}>
      <View style={styles.recordHeader}>
        <ThemedText type="defaultSemiBold">{item.changeType}</ThemedText>
        <ThemedText>{item.date.toLocaleDateString('ja-JP')}</ThemedText>
      </View>
      <ThemedText>変更量: {item.changeAmount}</ThemedText>
      <ThemedText style={styles.itemId}>アイテムID: {item.fridgeItemId}</ThemedText>
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
        履歴
      </ThemedText>
      {records.length === 0 ? (
        <ThemedText style={styles.emptyText}>履歴がありません</ThemedText>
      ) : (
        <FlatList
          data={records}
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
  recordCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemId: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
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
