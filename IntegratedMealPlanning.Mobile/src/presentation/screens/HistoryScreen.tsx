import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ChangeType, HistoryRecord } from '@/src/domain/entities/HistoryRecord';
import { diContainer } from '@/src/infrastructure/di/DIContainer';

interface CategoryGroup {
  category: string;
  count: number;
  subCategories: SubCategoryGroup[];
}

interface SubCategoryGroup {
  subCategory: string;
  count: number;
  records: HistoryRecord[];
}

/**
 * 履歴画面
 * 冷蔵庫の増減履歴を階層表示する
 */
export default function HistoryScreen() {
  const [selectedTab, setSelectedTab] = useState<ChangeType>(ChangeType.DECREASE);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedSubCategory, setSelectedSubCategory] = useState<{
    category: string;
    subCategory: string;
  } | null>(null);
  const [detailRecords, setDetailRecords] = useState<HistoryRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<HistoryRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 編集フォームの状態
  const [editDate, setEditDate] = useState('');
  const [editItemName, setEditItemName] = useState('');
  const [editChangeType, setEditChangeType] = useState<ChangeType>(ChangeType.DECREASE);
  const [editAmount, setEditAmount] = useState('');
  const [editUnit, setEditUnit] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const useCase = diContainer.getGetHistoryUseCase();
        const records = await useCase.getMonthlyHistory(
          currentYear,
          currentMonth,
          selectedTab
        );
        
        const grouped = groupByCategory(records);
        setCategoryGroups(grouped);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '履歴の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [currentYear, currentMonth, selectedTab]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const useCase = diContainer.getGetHistoryUseCase();
      const records = await useCase.getMonthlyHistory(
        currentYear,
        currentMonth,
        selectedTab
      );
      
      const grouped = groupByCategory(records);
      setCategoryGroups(grouped);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '履歴の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const groupByCategory = (records: HistoryRecord[]): CategoryGroup[] => {
    const categoryMap = new Map<string, Map<string, HistoryRecord[]>>();

    records.forEach((record) => {
      if (!categoryMap.has(record.category)) {
        categoryMap.set(record.category, new Map());
      }
      const subCategoryMap = categoryMap.get(record.category)!;
      if (!subCategoryMap.has(record.subCategory)) {
        subCategoryMap.set(record.subCategory, []);
      }
      subCategoryMap.get(record.subCategory)!.push(record);
    });

    const result: CategoryGroup[] = [];
    categoryMap.forEach((subCategoryMap, category) => {
      const subCategories: SubCategoryGroup[] = [];
      let totalCount = 0;

      subCategoryMap.forEach((records, subCategory) => {
        subCategories.push({
          subCategory,
          count: records.length,
          records: records.sort((a, b) => b.date.getTime() - a.date.getTime()),
        });
        totalCount += records.length;
      });

      // 小分類を50音順でソート
      subCategories.sort((a, b) => a.subCategory.localeCompare(b.subCategory, 'ja'));

      result.push({
        category,
        count: totalCount,
        subCategories,
      });
    });

    return result;
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSubCategoryPress = (category: string, subCategory: string) => {
    const categoryGroup = categoryGroups.find((g) => g.category === category);
    const subCategoryGroup = categoryGroup?.subCategories.find(
      (s) => s.subCategory === subCategory
    );
    if (subCategoryGroup) {
      setSelectedSubCategory({ category, subCategory });
      setDetailRecords(subCategoryGroup.records);
    }
  };

  const handleEditPress = (record: HistoryRecord) => {
    setEditingRecord(record);
    setEditDate(record.date.toISOString().split('T')[0]);
    setEditItemName(record.itemName);
    setEditChangeType(record.changeType);
    setEditAmount(record.changeAmount.toString());
    setEditUnit(record.unit);
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;

    try {
      const useCase = diContainer.getUpdateHistoryUseCase();
      await useCase.updateHistory(editingRecord.id, {
        date: new Date(editDate),
        itemName: editItemName,
        changeType: editChangeType,
        changeAmount: parseFloat(editAmount),
        unit: editUnit,
      });
      setEditingRecord(null);
      await loadHistory();
      // 詳細画面が開いていれば更新
      if (selectedSubCategory) {
        const categoryGroup = categoryGroups.find(
          (g) => g.category === selectedSubCategory.category
        );
        const subCategoryGroup = categoryGroup?.subCategories.find(
          (s) => s.subCategory === selectedSubCategory.subCategory
        );
        if (subCategoryGroup) {
          setDetailRecords(subCategoryGroup.records);
        }
      }
    } catch (err) {
      Alert.alert('エラー', err instanceof Error ? err.message : '更新に失敗しました');
    }
  };

  const handleDeleteEdit = async () => {
    if (!editingRecord) return;

    Alert.alert(
      '履歴を削除しますか？',
      'この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              const useCase = diContainer.getUpdateHistoryUseCase();
              await useCase.deleteHistory(editingRecord.id);
              setEditingRecord(null);
              await loadHistory();
              if (selectedSubCategory) {
                const categoryGroup = categoryGroups.find(
                  (g) => g.category === selectedSubCategory.category
                );
                const subCategoryGroup = categoryGroup?.subCategories.find(
                  (s) => s.subCategory === selectedSubCategory.subCategory
                );
                if (subCategoryGroup) {
                  setDetailRecords(subCategoryGroup.records);
                }
              }
            } catch (err) {
              Alert.alert(
                'エラー',
                err instanceof Error ? err.message : '削除に失敗しました'
              );
            }
          },
        },
      ]
    );
  };

  const navigateMonth = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[
          styles.tab,
          selectedTab === ChangeType.DECREASE && styles.activeTab,
        ]}
        onPress={() => setSelectedTab(ChangeType.DECREASE)}
      >
        <ThemedText
          style={[
            styles.tabText,
            selectedTab === ChangeType.DECREASE && styles.activeTabText,
          ]}
        >
          減った分
        </ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          selectedTab === ChangeType.INCREASE && styles.activeTab,
        ]}
        onPress={() => setSelectedTab(ChangeType.INCREASE)}
      >
        <ThemedText
          style={[
            styles.tabText,
            selectedTab === ChangeType.INCREASE && styles.activeTabText,
          ]}
        >
          増えた分
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderMonthNavigation = () => (
    <View style={styles.monthNav}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigateMonth(-1)}
      >
        <ThemedText style={styles.navButtonText}>←</ThemedText>
      </TouchableOpacity>
      <ThemedText style={styles.monthText}>
        {currentYear}年{currentMonth}月
      </ThemedText>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigateMonth(1)}
      >
        <ThemedText style={styles.navButtonText}>→</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderCategoryList = () => {
    if (categoryGroups.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyIcon}>📝</ThemedText>
          <ThemedText style={styles.emptyTitle}>この月の履歴はありません</ThemedText>
          <ThemedText style={styles.emptyDescription}>
            まだこの月には食材の増減がありません。{'\n'}
            食材を登録すると、ここに履歴が表示されます。
          </ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.listContainer}>
        {categoryGroups.map((group) => (
          <View key={group.category}>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => toggleCategory(group.category)}
            >
              <ThemedText style={styles.categoryIcon}>
                {expandedCategories.has(group.category) ? '📂' : '📁'}
              </ThemedText>
              <ThemedText style={styles.categoryName}>
                {group.category}
              </ThemedText>
              <ThemedText style={styles.categoryCount}>
                ({group.count}件)
              </ThemedText>
            </TouchableOpacity>

            {expandedCategories.has(group.category) && (
              <View style={styles.subCategoryContainer}>
                {group.subCategories.map((subGroup) => (
                  <TouchableOpacity
                    key={subGroup.subCategory}
                    style={styles.subCategoryCard}
                    onPress={() =>
                      handleSubCategoryPress(
                        group.category,
                        subGroup.subCategory
                      )
                    }
                  >
                    <ThemedText style={styles.subCategoryName}>
                      └ {subGroup.subCategory}
                    </ThemedText>
                    <ThemedText style={styles.subCategoryCount}>
                      ({subGroup.count}件)
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderDetailModal = () => (
    <Modal
      visible={selectedSubCategory !== null}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setSelectedSubCategory(null)}
    >
      <ThemedView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedSubCategory(null)}
          >
            <ThemedText style={styles.backButtonText}>← 戻る</ThemedText>
          </TouchableOpacity>
          <ThemedText type="subtitle" style={styles.modalTitle}>
            {selectedSubCategory?.subCategory}の履歴 - {currentYear}年{currentMonth}月
          </ThemedText>
        </View>

        <ScrollView style={styles.detailList}>
          {detailRecords.map((record) => (
            <View key={record.id} style={styles.detailCard}>
              <View style={styles.detailRow}>
                <ThemedText style={styles.detailDate}>
                  {record.date.getMonth() + 1}/{record.date.getDate()}
                </ThemedText>
                <ThemedText style={styles.detailName}>
                  {record.itemName}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.detailAmount,
                    record.changeType === ChangeType.INCREASE
                      ? styles.increaseText
                      : styles.decreaseText,
                  ]}
                >
                  {record.changeType === ChangeType.INCREASE ? '+' : '-'}
                  {record.changeAmount}
                  {record.unit}
                </ThemedText>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditPress(record)}
                >
                  <ThemedText style={styles.editButtonText}>📝</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </ThemedView>
    </Modal>
  );

  const renderEditModal = () => (
    <Modal
      visible={editingRecord !== null}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setEditingRecord(null)}
    >
      <View style={styles.editModalOverlay}>
        <ThemedView style={styles.editModalContent}>
          <View style={styles.editModalHeader}>
            <TouchableOpacity onPress={() => setEditingRecord(null)}>
              <ThemedText style={styles.closeButton}>×</ThemedText>
            </TouchableOpacity>
            <ThemedText type="subtitle">履歴を編集</ThemedText>
          </View>

          <View style={styles.editForm}>
            <ThemedText style={styles.label}>日付</ThemedText>
            <TextInput
              style={styles.input}
              value={editDate}
              onChangeText={setEditDate}
              placeholder="YYYY-MM-DD"
            />

            <ThemedText style={styles.label}>食材名</ThemedText>
            <TextInput
              style={styles.input}
              value={editItemName}
              onChangeText={setEditItemName}
              placeholder="食材名"
            />

            <ThemedText style={styles.label}>増減タイプ</ThemedText>
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  editChangeType === ChangeType.DECREASE &&
                    styles.typeButtonActive,
                ]}
                onPress={() => setEditChangeType(ChangeType.DECREASE)}
              >
                <ThemedText>減少</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  editChangeType === ChangeType.INCREASE &&
                    styles.typeButtonActive,
                ]}
                onPress={() => setEditChangeType(ChangeType.INCREASE)}
              >
                <ThemedText>増加</ThemedText>
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.label}>数量</ThemedText>
            <TextInput
              style={styles.input}
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="numeric"
              placeholder="数量"
            />

            <ThemedText style={styles.label}>単位</ThemedText>
            <TextInput
              style={styles.input}
              value={editUnit}
              onChangeText={setEditUnit}
              placeholder="単位 (例: g, kg, 個)"
            />

            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDeleteEdit}
              >
                <ThemedText style={styles.deleteButtonText}>
                  🗑 削除
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <ThemedText style={styles.saveButtonText}>💾 保存</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ThemedView>
      </View>
    </Modal>
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
      {renderTabBar()}
      {renderMonthNavigation()}
      <ScrollView style={styles.scrollView}>
        {renderCategoryList()}
      </ScrollView>
      {renderDetailModal()}
      {renderEditModal()}
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
  },
  subCategoryContainer: {
    marginLeft: 16,
    marginBottom: 8,
  },
  subCategoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#007AFF',
  },
  subCategoryName: {
    fontSize: 14,
    flex: 1,
  },
  subCategoryCount: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 64,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 48,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 16,
  },
  detailList: {
    flex: 1,
    padding: 16,
  },
  detailCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailDate: {
    fontSize: 14,
    color: '#6c757d',
    width: 50,
  },
  detailName: {
    fontSize: 14,
    flex: 1,
    marginLeft: 8,
  },
  detailAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  increaseText: {
    color: '#28a745',
  },
  decreaseText: {
    color: '#dc3545',
  },
  editButton: {
    padding: 4,
  },
  editButtonText: {
    fontSize: 18,
  },
  editModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
  },
  editModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 32,
    marginRight: 16,
    color: '#666',
  },
  editForm: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
