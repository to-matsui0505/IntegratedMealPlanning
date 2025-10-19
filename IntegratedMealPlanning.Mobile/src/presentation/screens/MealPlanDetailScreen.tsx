import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Linking,
  Button,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { MealPlan } from '@/src/domain/entities/MealPlan';
import { diContainer } from '@/src/infrastructure/di/DIContainer';

/**
 * 献立詳細画面
 * 選択した献立の詳細情報を表示する
 */
export default function MealPlanDetailScreen({ mealPlanId }: { mealPlanId: string }) {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const useCase = diContainer.getGetMealPlanDetailUseCase();
        const plan = await useCase.execute(mealPlanId);
        setMealPlan(plan);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [mealPlanId]);

  const openRecipeUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error || !mealPlan) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.errorText}>
          {error || '献立が見つかりません'}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title" style={styles.title}>
          献立詳細
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="subtitle">期間</ThemedText>
          <ThemedText>
            {mealPlan.startDate.toLocaleDateString('ja-JP')} 〜{' '}
            {mealPlan.endDate.toLocaleDateString('ja-JP')}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle">推定予算</ThemedText>
          <ThemedText>¥{mealPlan.estimatedBudget.toLocaleString()}</ThemedText>
        </View>

        {mealPlan.allergens.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle">除外アレルゲン</ThemedText>
            <ThemedText>{mealPlan.allergens.join(', ')}</ThemedText>
          </View>
        )}

        <View style={styles.section}>
          <ThemedText type="subtitle">献立アイテム</ThemedText>
          {mealPlan.items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <ThemedText type="defaultSemiBold">
                {item.date.toLocaleDateString('ja-JP')} - {item.mealType}
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.dishName}>
                {item.dishName}
              </ThemedText>
              <ThemedText>材料: {item.ingredients.join(', ')}</ThemedText>
              <ThemedText>カロリー: {item.estimatedCalories} kcal</ThemedText>
              <ThemedText>コスト: ¥{item.estimatedCost}</ThemedText>
              <ThemedText style={styles.recipe}>{item.recipeText}</ThemedText>
              {item.externalRecipeUrl && (
                <View style={styles.buttonContainer}>
                  <Button
                    title="レシピサイトを見る"
                    onPress={() => openRecipeUrl(item.externalRecipeUrl)}
                  />
                </View>
              )}
            </View>
          ))}
        </View>
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
  section: {
    marginBottom: 24,
  },
  itemCard: {
    padding: 16,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  dishName: {
    marginTop: 8,
    fontSize: 18,
  },
  recipe: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 12,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
