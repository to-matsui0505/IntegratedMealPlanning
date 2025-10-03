import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { MealPlan } from '../../domain/entities/MealPlan';
import { GetMealPlansUseCase } from '../../application/usecases/GetMealPlansUseCase';

interface MealPlanListScreenProps {
  getMealPlansUseCase: GetMealPlansUseCase;
  onSelectPlan: (plan: MealPlan) => void;
}

/**
 * 献立一覧画面
 * 作成された献立を日付ごとに一覧表示
 */
export const MealPlanListScreen: React.FC<MealPlanListScreenProps> = ({
  getMealPlansUseCase,
  onSelectPlan,
}) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  useEffect(() => {
    loadMealPlans();
  }, []);

  const loadMealPlans = async () => {
    const plans = await getMealPlansUseCase.execute();
    setMealPlans(plans);
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>献立一覧</Text>
      <FlatList
        data={mealPlans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => onSelectPlan(item)}>
            <View style={styles.itemHeader}>
              <Text style={styles.date}>{formatDate(item.date)}</Text>
              <Text style={styles.mealType}>{item.mealType}</Text>
            </View>
            <Text style={styles.dishName}>{item.dishName}</Text>
            <View style={styles.itemFooter}>
              <Text style={styles.info}>
                予算: ¥{item.estimatedBudget}
              </Text>
              <Text style={styles.info}>
                カロリー: {item.estimatedCalories}kcal
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>献立がありません</Text>
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
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  mealType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#999',
  },
});
