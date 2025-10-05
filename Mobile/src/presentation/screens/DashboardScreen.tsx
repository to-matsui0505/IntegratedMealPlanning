import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { FridgeItem } from '../../domain/entities/FridgeItem';
import { Activity, ActivityType } from '../../domain/entities/Activity';
import { Summary } from '../../domain/entities/Summary';
import { GetCurrentItemsUseCase } from '../../application/GetCurrentItemsUseCase';
import { GetSummaryUseCase } from '../../application/GetSummaryUseCase';
import { GetActivitiesUseCase } from '../../application/GetActivitiesUseCase';
import { FridgeRepositoryImpl } from '../../infrastructure/database/FridgeRepositoryImpl';
import { ActivityRepositoryImpl } from '../../infrastructure/database/ActivityRepositoryImpl';

const screenWidth = Dimensions.get('window').width;

export const DashboardScreen: React.FC = () => {
  const [items, setItems] = useState<FridgeItem[]>([]);
  const [summary, setSummary] = useState<Summary[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sortBy, setSortBy] = useState<'qty' | 'date'>('date');

  const fridgeRepository = useMemo(() => new FridgeRepositoryImpl(), []);
  const activityRepository = useMemo(() => new ActivityRepositoryImpl(), []);
  const getCurrentItemsUseCase = useMemo(
    () => new GetCurrentItemsUseCase(fridgeRepository),
    [fridgeRepository],
  );
  const getSummaryUseCase = useMemo(
    () => new GetSummaryUseCase(fridgeRepository),
    [fridgeRepository],
  );
  const getActivitiesUseCase = useMemo(
    () => new GetActivitiesUseCase(activityRepository),
    [activityRepository],
  );

  const loadData = useCallback(async () => {
    const [itemsData, summaryData, activitiesData] = await Promise.all([
      getCurrentItemsUseCase.execute(),
      getSummaryUseCase.execute(),
      getActivitiesUseCase.execute(10),
    ]);
    setItems(itemsData);
    setSummary(summaryData);
    setActivities(activitiesData);
  }, [getCurrentItemsUseCase, getSummaryUseCase, getActivitiesUseCase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'qty') {
      return b.quantity - a.quantity;
    }
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  const chartData = summary.map((s, index) => ({
    name: s.category,
    population: s.itemCount,
    color: getColorForCategory(index),
    legendFontColor: '#333',
    legendFontSize: 12,
  }));

  const totalItems = summary.reduce((sum, s) => sum + s.itemCount, 0);
  const totalCategories = summary.length;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* サマリーカード */}
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalItems}</Text>
            <Text style={styles.summaryLabel}>合計品目数</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalCategories}</Text>
            <Text style={styles.summaryLabel}>カテゴリ数</Text>
          </View>
        </View>

        {/* 円グラフセクション */}
        {chartData.length > 0 && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>カテゴリ別在庫</Text>
            <PieChart
              data={chartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}

        {/* 最近のアクティビティ */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>最近のアクティビティ</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>すべて表示</Text>
            </TouchableOpacity>
          </View>
          {activities.map(activity => (
            <View key={activity.id} style={styles.activityItem}>
              <View
                style={[
                  styles.activityIcon,
                  { backgroundColor: getActivityColor(activity.type) },
                ]}>
                <Text style={styles.activityIconText}>
                  {getActivityIcon(activity.type)}
                </Text>
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityItemName}>{activity.itemName}</Text>
                <Text style={styles.activityTimestamp}>
                  {formatTimestamp(activity.timestamp)}
                </Text>
              </View>
              <Text style={styles.activityType}>
                {getActivityTypeLabel(activity.type)}
              </Text>
            </View>
          ))}
        </View>

        {/* 在庫リスト */}
        <View style={styles.inventorySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>在庫リスト</Text>
            <View style={styles.sortButtons}>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortBy === 'date' && styles.sortButtonActive,
                ]}
                onPress={() => setSortBy('date')}>
                <Text
                  style={[
                    styles.sortButtonText,
                    sortBy === 'date' && styles.sortButtonTextActive,
                  ]}>
                  日付順
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  sortBy === 'qty' && styles.sortButtonActive,
                ]}
                onPress={() => setSortBy('qty')}>
                <Text
                  style={[
                    styles.sortButtonText,
                    sortBy === 'qty' && styles.sortButtonTextActive,
                  ]}>
                  数量順
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {sortedItems.map(item => (
            <View key={item.id} style={styles.inventoryItem}>
              <View style={styles.inventoryItemMain}>
                <Text style={styles.inventoryItemName}>{item.name}</Text>
                <Text style={styles.inventoryItemCategory}>{item.category}</Text>
              </View>
              <Text style={styles.inventoryItemQty}>
                {item.quantity} {item.unit}
              </Text>
            </View>
          ))}
        </View>

        {/* スペーサー（FABのための余白） */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* フローティングアクションボタン */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabSecondary}>
          <Text style={styles.fabText}>献立作成</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fabPrimary}>
          <Text style={styles.fabText}>+ 食材追加</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ヘルパー関数
const getColorForCategory = (index: number): string => {
  const colors = [
    '#4CAF50', // 緑
    '#F44336', // 赤
    '#2196F3', // 青
    '#FFC107', // 黄色
    '#9C27B0', // 紫
    '#FF9800', // オレンジ
  ];
  return colors[index % colors.length];
};

const getActivityColor = (type: ActivityType): string => {
  switch (type) {
    case ActivityType.ADD:
      return '#4CAF50';
    case ActivityType.USE:
      return '#2196F3';
    case ActivityType.DISCARD:
      return '#F44336';
    case ActivityType.EDIT:
      return '#FF9800';
    case ActivityType.MEAL_PLAN:
      return '#9C27B0';
    default:
      return '#757575';
  }
};

const getActivityIcon = (type: ActivityType): string => {
  switch (type) {
    case ActivityType.ADD:
      return '+';
    case ActivityType.USE:
      return '↓';
    case ActivityType.DISCARD:
      return '×';
    case ActivityType.EDIT:
      return '✎';
    case ActivityType.MEAL_PLAN:
      return '☰';
    default:
      return '•';
  }
};

const getActivityTypeLabel = (type: ActivityType): string => {
  switch (type) {
    case ActivityType.ADD:
      return '追加';
    case ActivityType.USE:
      return '使用';
    case ActivityType.DISCARD:
      return '廃棄';
    case ActivityType.EDIT:
      return '編集';
    case ActivityType.MEAL_PLAN:
      return '献立';
    default:
      return '';
  }
};

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) {
    return `${minutes}分前`;
  } else if (hours < 24) {
    return `${hours}時間前`;
  } else if (days < 7) {
    return `${days}日前`;
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  summaryCards: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  chartSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activitySection: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inventorySection: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  linkText: {
    fontSize: 14,
    color: '#2196F3',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activityDetails: {
    flex: 1,
  },
  activityItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  activityTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  activityType: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  sortButtonActive: {
    backgroundColor: '#2196F3',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#FFF',
    fontWeight: '500',
  },
  inventoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  inventoryItemMain: {
    flex: 1,
  },
  inventoryItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  inventoryItemCategory: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  inventoryItemQty: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 100,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    alignItems: 'flex-end',
    gap: 12,
  },
  fabPrimary: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabSecondary: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
