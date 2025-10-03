import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { FridgeItem } from '../../domain/entities/FridgeItem';
import { GetCurrentItemsUseCase } from '../../application/usecases/GetCurrentItemsUseCase';

interface DashboardScreenProps {
  getCurrentItemsUseCase: GetCurrentItemsUseCase;
}

/**
 * ダッシュボード画面
 * 現在の冷蔵庫の中身を一覧表示
 */
export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  getCurrentItemsUseCase,
}) => {
  const [items, setItems] = useState<FridgeItem[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const currentItems = await getCurrentItemsUseCase.execute();
    setItems(currentItems);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>冷蔵庫の中身</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>
              {item.category} / {item.subCategory}
            </Text>
            <Text style={styles.itemQuantity}>
              {item.quantity} {item.unit}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>アイテムがありません</Text>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemQuantity: {
    fontSize: 16,
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#999',
  },
});
