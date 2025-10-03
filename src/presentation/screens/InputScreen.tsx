import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { AddItemUseCase } from '../../application/usecases/AddItemUseCase';
import { AnalyzeImageUseCase } from '../../application/usecases/AnalyzeImageUseCase';

interface InputScreenProps {
  addItemUseCase: AddItemUseCase;
  analyzeImageUseCase: AnalyzeImageUseCase;
}

/**
 * 入力画面
 * 3種類の入力方法を提供：
 * 1. カメラ撮影 → AI画像分析 → 手入力補正 → 登録
 * 2. レシート撮影 → AI画像分析 → 手入力補正 → 登録
 * 3. 手入力 → 登録
 */
export const InputScreen: React.FC<InputScreenProps> = ({
  addItemUseCase,
  analyzeImageUseCase,
}) => {
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  const handleManualInput = async () => {
    if (!category || !subCategory || !name || !quantity || !unit) {
      Alert.alert('エラー', 'すべての項目を入力してください');
      return;
    }

    try {
      await addItemUseCase.execute(
        category,
        subCategory,
        name,
        parseFloat(quantity),
        unit,
      );
      Alert.alert('成功', 'アイテムを登録しました');
      clearForm();
    } catch (error) {
      Alert.alert('エラー', 'アイテムの登録に失敗しました');
    }
  };

  const handleCameraCapture = async () => {
    // TODO: カメラ撮影機能の実装
    Alert.alert('未実装', 'カメラ撮影機能は未実装です');
  };

  const handleReceiptScan = async () => {
    // TODO: レシート撮影機能の実装
    Alert.alert('未実装', 'レシート撮影機能は未実装です');
  };

  const clearForm = () => {
    setCategory('');
    setSubCategory('');
    setName('');
    setQuantity('');
    setUnit('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>食材登録</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCameraCapture}>
          <Text style={styles.buttonText}>カメラ撮影</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleReceiptScan}>
          <Text style={styles.buttonText}>レシート撮影</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>手入力</Text>

      <TextInput
        style={styles.input}
        placeholder="大分類（例: 肉類）"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="小分類（例: 牛肉）"
        value={subCategory}
        onChangeText={setSubCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="名称（例: サーロイン）"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="数量"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="単位（例: g, 個）"
        value={unit}
        onChangeText={setUnit}
      />

      <Button title="登録" onPress={handleManualInput} />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
});
