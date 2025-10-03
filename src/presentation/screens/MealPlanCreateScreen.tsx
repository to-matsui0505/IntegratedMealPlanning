import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { GenerateMealPlanUseCase } from '../../application/usecases/GenerateMealPlanUseCase';

interface MealPlanCreateScreenProps {
  generateMealPlanUseCase: GenerateMealPlanUseCase;
}

/**
 * 献立作成画面
 * 期間選択、アレルゲン設定、予算設定を行い、AIで献立を自動生成
 */
export const MealPlanCreateScreen: React.FC<MealPlanCreateScreenProps> = ({
  generateMealPlanUseCase,
}) => {
  const [days, setDays] = useState('7');
  const [maxBudget, setMaxBudget] = useState('');

  const handleGenerate = async () => {
    const numDays = parseInt(days);
    if (isNaN(numDays) || numDays < 1 || numDays > 30) {
      Alert.alert('エラー', '1〜30日の範囲で入力してください');
      return;
    }

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + numDays);

      await generateMealPlanUseCase.execute({
        startDate,
        endDate,
        maxBudget: maxBudget ? parseFloat(maxBudget) : undefined,
      });

      Alert.alert('成功', '献立を生成しました');
    } catch (error) {
      Alert.alert('エラー', '献立の生成に失敗しました');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>献立作成</Text>

      <View style={styles.section}>
        <Text style={styles.label}>期間（日数）</Text>
        <TextInput
          style={styles.input}
          placeholder="7（1〜30日）"
          value={days}
          onChangeText={setDays}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>予算上限（オプション）</Text>
        <TextInput
          style={styles.input}
          placeholder="例: 10000"
          value={maxBudget}
          onChangeText={setMaxBudget}
          keyboardType="numeric"
        />
        <Text style={styles.hint}>※未入力の場合は予算制限なし</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>アレルゲン設定</Text>
        <Text style={styles.hint}>
          ※アレルゲン管理画面で設定したアレルゲンを自動的に考慮します
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.infoTitle}>AIが考慮する内容：</Text>
        <Text style={styles.infoText}>• 冷蔵庫の中身を優先的に使用</Text>
        <Text style={styles.infoText}>• 足りない食材は購入前提で献立作成</Text>
        <Text style={styles.infoText}>• アレルゲンを避ける</Text>
        <Text style={styles.infoText}>• 予算内に収める</Text>
        <Text style={styles.infoText}>• カロリー情報を提供</Text>
        <Text style={styles.infoText}>• 詳細な調理手順を提供</Text>
      </View>

      <Button title="献立を生成" onPress={handleGenerate} />
    </ScrollView>
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
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginBottom: 4,
  },
});
