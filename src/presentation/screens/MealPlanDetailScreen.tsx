import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MealPlan } from '../../domain/entities/MealPlan';

interface MealPlanDetailScreenProps {
  mealPlan: MealPlan;
}

/**
 * 献立詳細画面
 * 料理の詳細情報、食材リスト、調理手順、予算、カロリーを表示
 */
export const MealPlanDetailScreen: React.FC<MealPlanDetailScreenProps> = ({
  mealPlan,
}) => {
  const handleOpenRecipe = () => {
    if (mealPlan.recipeUrl) {
      Linking.openURL(mealPlan.recipeUrl);
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(mealPlan.date)}</Text>
        <Text style={styles.mealType}>{mealPlan.mealType}</Text>
      </View>

      <Text style={styles.dishName}>{mealPlan.dishName}</Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>予算</Text>
          <Text style={styles.infoValue}>¥{mealPlan.estimatedBudget}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>カロリー</Text>
          <Text style={styles.infoValue}>{mealPlan.estimatedCalories}kcal</Text>
        </View>
      </View>

      {mealPlan.allergens.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アレルゲン情報</Text>
          <Text style={styles.allergens}>{mealPlan.allergens.join(', ')}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>必要な食材</Text>
        {mealPlan.ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientItem}>
            <Text style={styles.ingredientName}>
              {ingredient.name} - {ingredient.quantity}{ingredient.unit}
            </Text>
            <Text
              style={[
                styles.ingredientStatus,
                ingredient.inFridge ? styles.inFridge : styles.needToBuy,
              ]}>
              {ingredient.inFridge ? '冷蔵庫にあり' : '購入が必要'}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>調理手順</Text>
        {mealPlan.cookingSteps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <Text style={styles.stepNumber}>{index + 1}.</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      {mealPlan.recipeUrl && (
        <TouchableOpacity style={styles.linkButton} onPress={handleOpenRecipe}>
          <Text style={styles.linkButtonText}>料理サイトで詳しく見る</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  mealType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  dishName: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  allergens: {
    fontSize: 14,
    color: '#d32f2f',
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ingredientName: {
    fontSize: 16,
    flex: 1,
  },
  ingredientStatus: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  inFridge: {
    backgroundColor: '#e8f5e9',
    color: '#4caf50',
  },
  needToBuy: {
    backgroundColor: '#fff3e0',
    color: '#ff9800',
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 24,
  },
  stepText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
  linkButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
