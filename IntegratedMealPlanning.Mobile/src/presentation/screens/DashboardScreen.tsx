import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { FridgeItem } from '@/src/domain/entities/FridgeItem';
import { Summary } from '@/src/domain/entities/Summary';
import { Activity } from '@/src/domain/entities/Activity';
import { diContainer } from '@/src/infrastructure/di/DIContainer';
import { CategoryChart } from '@/src/presentation/components/CategoryChart';
import { RecentActivityList } from '@/src/presentation/components/RecentActivityList';
import { SummaryCard } from '@/src/presentation/components/SummaryCard';
import { FloatingActionButtons } from '@/src/presentation/components/FloatingActionButtons';
import { useRouter } from 'expo-router';

/**
 * ダッシュボード画面
 * 現在の冷蔵庫の中身を一覧表示する
 */
export default function DashboardScreen() {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // 冷蔵庫アイテムを取得
      const itemsUseCase = diContainer.getGetCurrentItemsUseCase();
      const fridgeItems = await itemsUseCase.execute();
      setItems(fridgeItems);
      
      // サマリーを取得
      const summaryUseCase = diContainer.getGetDashboardSummaryUseCase();
      const summaryData = await summaryUseCase.execute();
      setSummaries(summaryData);
      
      // 最近のアクティビティを取得
      const activitiesUseCase = diContainer.getGetRecentActivitiesUseCase();
      const recentActivities = await activitiesUseCase.execute(10);
      setActivities(recentActivities);
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    router.push('/input');
  };

  const handleCreateMealPlan = () => {
    router.push('/mealplan');
  };

  const handleSeeMoreActivities = () => {
    // TODO: アクティビティ一覧画面への遷移（未実装）
    console.log('See more activities');
  };

  const handleSeeMoreInventory = () => {
    // TODO: 在庫一覧画面への遷移（未実装）
    console.log('See more inventory');
  };

  const renderItem = ({ item }: { item: FridgeItem }) => (
    <ThemedView style={styles.itemCard}>
      <ThemedText type="subtitle">{item.name}</ThemedText>
      <View style={styles.itemDetails}>
        <ThemedText>
          分類: {item.category} / {item.subCategory}
        </ThemedText>
        <ThemedText>
          数量: {item.quantity} {item.unit}
        </ThemedText>
        <ThemedText>更新日: {item.updatedAt.toLocaleDateString('ja-JP')}</ThemedText>
      </View>
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
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.title}>
          ダッシュボード
        </ThemedText>
        
        {/* サマリーカード */}
        <SummaryCard
          totalItems={items.length}
          totalCategories={summaries.length}
        />
        
        {/* カテゴリ別在庫チャート */}
        <CategoryChart summaries={summaries} />
        
        {/* 最近のアクティビティ */}
        <RecentActivityList 
          activities={activities}
          onSeeMore={handleSeeMoreActivities}
        />
        
        {/* 在庫リスト */}
        <ThemedView style={styles.inventorySection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            在庫一覧
          </ThemedText>
          {items.length === 0 ? (
            <ThemedText style={styles.emptyText}>冷蔵庫にアイテムがありません</ThemedText>
          ) : (
            <>
              <FlatList
                data={items.slice(0, 5)}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                scrollEnabled={false}
              />
              {items.length > 5 && (
                <TouchableOpacity 
                  style={styles.seeMoreButton}
                  onPress={handleSeeMoreInventory}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.seeMoreText}>もっと見る</ThemedText>
                </TouchableOpacity>
              )}
            </>
          )}
        </ThemedView>
      </ScrollView>
      
      {/* フローティングアクションボタン */}
      <FloatingActionButtons
        onAddItem={handleAddItem}
        onCreateMealPlan={handleCreateMealPlan}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 100, // フローティングボタンのためのスペース
  },
  title: {
    marginBottom: 8,
  },
  inventorySection: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  itemCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  itemDetails: {
    marginTop: 8,
    gap: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  seeMoreButton: {
    marginTop: 12,
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  seeMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});
