import React, { useState } from 'react';
import { StyleSheet, Button, ScrollView, View, Alert, TextInput } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { diContainer } from '@/src/infrastructure/di/DIContainer';

/**
 * 献立作成画面
 * AIを使って献立を作成する
 */
export default function MealPlanScreen() {
  const [days, setDays] = useState('3');
  const [allergens, setAllergens] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleCreateMealPlan = async () => {
    try {
      setGenerating(true);

      const numDays = parseInt(days, 10);
      if (isNaN(numDays) || numDays < 1 || numDays > 31) {
        Alert.alert('エラー', '日数は1〜31の間で指定してください');
        return;
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + numDays - 1);

      const allergenList = allergens
        .split(',')
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      const useCase = diContainer.getCreateMealPlanUseCase();
      const mealPlan = await useCase.execute(startDate, endDate, allergenList);

      Alert.alert(
        '成功',
        `献立を作成しました\n期間: ${mealPlan.startDate.toLocaleDateString('ja-JP')} 〜 ${mealPlan.endDate.toLocaleDateString('ja-JP')}\n推定予算: ¥${mealPlan.estimatedBudget}`
      );
    } catch (err) {
      Alert.alert('エラー', err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title" style={styles.title}>
          献立作成
        </ThemedText>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">日数（1〜31日）</ThemedText>
          <TextInput
            style={styles.input}
            value={days}
            onChangeText={setDays}
            placeholder="例: 3"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <ThemedText type="defaultSemiBold">アレルゲン（カンマ区切り）</ThemedText>
          <TextInput
            style={styles.input}
            value={allergens}
            onChangeText={setAllergens}
            placeholder="例: 卵, 乳製品, 小麦"
          />
        </View>

        <View style={styles.infoBox}>
          <ThemedText type="defaultSemiBold">機能説明</ThemedText>
          <ThemedText style={styles.infoText}>
            • 冷蔵庫の中身から最適な献立をAIが提案
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • アレルゲンを考慮した献立作成
          </ThemedText>
          <ThemedText style={styles.infoText}>• 予算とカロリーの目安を表示</ThemedText>
        </View>

        <Button
          title={generating ? '作成中...' : '献立を作成'}
          onPress={handleCreateMealPlan}
          disabled={generating}
        />
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
  infoBox: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    marginTop: 8,
  },
});
