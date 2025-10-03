import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { HistoryRecord } from '../../domain/entities/HistoryRecord';
import { GetHistoryUseCase } from '../../application/usecases/GetHistoryUseCase';

interface HistoryScreenProps {
  getHistoryUseCase: GetHistoryUseCase;
}

/**
 * 履歴画面
 * 日々の冷蔵庫の中身の増減を表示
 */
export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  getHistoryUseCase,
}) => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const records = await getHistoryUseCase.execute();
    setHistory(records);
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>履歴</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
            <Text style={styles.changeType}>{item.changeType}</Text>
            <Text style={styles.amount}>
              {item.changeType === '増加' ? '+' : '-'}
              {item.changeAmount}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>履歴がありません</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  date: {
    fontSize: 16,
    flex: 1,
  },
  changeType: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#999',
  },
});
