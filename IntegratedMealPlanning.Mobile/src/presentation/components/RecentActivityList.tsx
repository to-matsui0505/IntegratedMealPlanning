import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Activity, ActivityType } from '@/src/domain/entities/Activity';

interface RecentActivityListProps {
  activities: Activity[];
  onSeeMore?: () => void;
}

/**
 * 最近のアクティビティリストコンポーネント
 * 最近の冷蔵庫操作履歴を表示する（最大5件）
 */
export function RecentActivityList({ activities, onSeeMore }: RecentActivityListProps) {
  const maxDisplayCount = 5;
  const displayActivities = activities.slice(0, maxDisplayCount);
  const hasMore = activities.length > maxDisplayCount;
  const getActivityIcon = (type: ActivityType): string => {
    switch (type) {
      case ActivityType.ADD:
        return '➕';
      case ActivityType.USE:
        return '🍳';
      case ActivityType.DISCARD:
        return '🗑️';
      case ActivityType.EDIT:
        return '✏️';
      case ActivityType.MEAL_PLAN:
        return '📅';
      default:
        return '📦';
    }
  };

  const getActivityLabel = (type: ActivityType): string => {
    switch (type) {
      case ActivityType.ADD:
        return '追加';
      case ActivityType.USE:
        return '使用';
      case ActivityType.DISCARD:
        return '破棄';
      case ActivityType.EDIT:
        return '編集';
      case ActivityType.MEAL_PLAN:
        return '献立作成';
      default:
        return '操作';
    }
  };

  const renderActivity = ({ item }: { item: Activity }) => (
    <ThemedView style={styles.activityCard}>
      <View style={styles.activityIcon}>
        <ThemedText style={styles.iconText}>{getActivityIcon(item.type)}</ThemedText>
      </View>
      <View style={styles.activityInfo}>
        <View style={styles.activityHeader}>
          <ThemedText style={styles.activityType}>{getActivityLabel(item.type)}</ThemedText>
          <ThemedText style={styles.activityTime}>
            {item.timestamp.toLocaleString('ja-JP', {
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </ThemedText>
        </View>
        <ThemedText style={styles.activityName}>{item.itemName}</ThemedText>
        {item.qty && (
          <ThemedText style={styles.activityQty}>数量: {item.qty}</ThemedText>
        )}
      </View>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        最近のアクティビティ
      </ThemedText>
      
      {activities.length === 0 ? (
        <ThemedText style={styles.emptyText}>アクティビティがありません</ThemedText>
      ) : (
        <>
          <FlatList
            data={displayActivities}
            renderItem={renderActivity}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            scrollEnabled={false}
          />
          {hasMore && (
            <TouchableOpacity 
              style={styles.seeMoreButton}
              onPress={onSeeMore}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.seeMoreText}>もっと見る</ThemedText>
            </TouchableOpacity>
          )}
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    marginBottom: 12,
  },
  list: {
    gap: 8,
  },
  activityCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  activityInfo: {
    flex: 1,
    gap: 4,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityType: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
  },
  activityTime: {
    fontSize: 11,
    opacity: 0.6,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityQty: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    paddingVertical: 20,
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
