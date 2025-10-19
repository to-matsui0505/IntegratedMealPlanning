import React, { useState } from 'react';
import { StyleSheet, TextInput, Button, ScrollView, View, Alert } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { FridgeItem, ItemType } from '@/src/domain/entities/FridgeItem';
import { diContainer } from '@/src/infrastructure/di/DIContainer';

/**
 * 入力画面
 * 冷蔵庫にアイテムを追加する
 */
export default function InputScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  const handleAddItem = async () => {
    try {
      // 数量のバリデーション
      const quantityNum = parseFloat(quantity);
      if (isNaN(quantityNum)) {
        Alert.alert('エラー', '数量には有効な数値を入力してください');
        return;
      }

      const item: FridgeItem = {
        id: `item-${Date.now()}`,
        type: ItemType.INBOUND,
        category,
        subCategory,
        name,
        quantity: quantityNum,
        unit,
        updatedAt: new Date(),
      };

      const useCase = diContainer.getAddItemUseCase();
      await useCase.execute(item);

      Alert.alert('成功', 'アイテムを追加しました');
      
      // フォームをリセット
      setName('');
      setCategory('');
      setSubCategory('');
      setQuantity('');
      setUnit('');
    } catch (err) {
      Alert.alert('エラー', err instanceof Error ? err.message : '不明なエラーが発生しました');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title" style={styles.title}>
          アイテム追加
        </ThemedText>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">名称</ThemedText>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="例: レタス"
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">大分類</ThemedText>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="例: 野菜類"
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">小分類</ThemedText>
          <TextInput
            style={styles.input}
            value={subCategory}
            onChangeText={setSubCategory}
            placeholder="例: 葉物野菜"
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">数量</ThemedText>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="例: 1"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">単位</ThemedText>
          <TextInput
            style={styles.input}
            value={unit}
            onChangeText={setUnit}
            placeholder="例: 個"
          />
        </View>

        <Button title="追加" onPress={handleAddItem} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    backgroundColor: 'white',
  },
});
