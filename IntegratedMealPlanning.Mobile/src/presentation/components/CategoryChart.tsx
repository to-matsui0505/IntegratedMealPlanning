import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Summary } from '@/src/domain/entities/Summary';

interface CategoryChartProps {
  summaries: Summary[];
}

/**
 * カテゴリ別サマリーチャートコンポーネント
 * カテゴリごとの在庫を円グラフで視覚的に表示する
 */
export function CategoryChart({ summaries }: CategoryChartProps) {
  const totalItems = summaries.reduce((sum, s) => sum + s.itemCount, 0);
  
  // カテゴリごとの色を定義
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  
  // 円グラフの描画
  const renderPieChart = () => {
    if (summaries.length === 0) return null;
    
    const pieSize = 150;
    const radius = pieSize / 2;
    let currentAngle = -90; // 上から開始
    
    return (
      <View style={styles.pieChartContainer}>
        <View style={[styles.pieChart, { width: pieSize, height: pieSize }]}>
          {summaries.map((summary, index) => {
            const percentage = totalItems > 0 ? (summary.itemCount / totalItems) : 0;
            const angle = percentage * 360;
            const color = colors[index % colors.length];
            
            // 簡易的な円グラフセクション（矩形で表現）
            const segmentStyle = {
              position: 'absolute' as const,
              width: radius,
              height: radius,
              backgroundColor: color,
              transform: [{ rotate: `${currentAngle}deg` }],
              transformOrigin: 'center',
            };
            
            currentAngle += angle;
            
            return (
              <View
                key={summary.category}
                style={[
                  styles.pieSegment,
                  {
                    backgroundColor: color,
                    flex: percentage,
                  },
                ]}
              />
            );
          })}
        </View>
      </View>
    );
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        カテゴリ別在庫
      </ThemedText>
      
      {summaries.length === 0 ? (
        <ThemedText style={styles.emptyText}>データがありません</ThemedText>
      ) : (
        <>
          {/* 簡易円グラフ表示 */}
          <View style={styles.pieChartWrapper}>
            {summaries.map((summary, index) => {
              const percentage = totalItems > 0 ? (summary.itemCount / totalItems) * 100 : 0;
              const color = colors[index % colors.length];
              return (
                <View
                  key={summary.category}
                  style={[
                    styles.pieSlice,
                    {
                      backgroundColor: color,
                      width: `${percentage}%`,
                    },
                  ]}
                />
              );
            })}
          </View>
          
          {/* 凡例 */}
          <View style={styles.chartContainer}>
            {summaries.map((summary, index) => {
              const percentage = totalItems > 0 ? (summary.itemCount / totalItems) * 100 : 0;
              return (
                <View key={summary.category} style={styles.categoryRow}>
                  <View
                    style={[
                      styles.colorBox,
                      { backgroundColor: colors[index % colors.length] },
                    ]}
                  />
                  <View style={styles.categoryInfo}>
                    <ThemedText style={styles.categoryName}>{summary.category}</ThemedText>
                    <ThemedText style={styles.categoryStats}>
                      {summary.itemCount}品目 ({percentage.toFixed(1)}%)
                    </ThemedText>
                  </View>
                </View>
              );
            })}
          </View>
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
  pieChartWrapper: {
    flexDirection: 'row',
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 16,
    alignSelf: 'center',
  },
  pieSlice: {
    height: '100%',
  },
  pieChartContainer: {
    gap: 8,
  },
  pieChart: {
    borderRadius: 1000,
    overflow: 'hidden',
  },
  pieSegment: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  chartContainer: {
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryStats: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
    paddingVertical: 20,
  },
});
