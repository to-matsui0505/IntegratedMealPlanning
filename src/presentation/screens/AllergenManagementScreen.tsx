import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Allergen } from '../../domain/entities/Allergen';
import { ManageAllergensUseCase } from '../../application/usecases/ManageAllergensUseCase';

interface AllergenManagementScreenProps {
  manageAllergensUseCase: ManageAllergensUseCase;
}

/**
 * アレルゲン管理画面
 * アレルゲンの登録・編集・削除
 */
export const AllergenManagementScreen: React.FC<
  AllergenManagementScreenProps
> = ({ manageAllergensUseCase }) => {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [newAllergenName, setNewAllergenName] = useState('');

  // よくあるアレルゲンのプリセット
  const commonAllergens = [
    '卵',
    '乳製品',
    '小麦',
    'そば',
    '落花生',
    'えび',
    'かに',
  ];

  useEffect(() => {
    loadAllergens();
  }, []);

  const loadAllergens = async () => {
    const allAllergens = await manageAllergensUseCase.getAll();
    setAllergens(allAllergens);
  };

  const handleAdd = async () => {
    if (!newAllergenName.trim()) {
      Alert.alert('エラー', 'アレルゲン名を入力してください');
      return;
    }

    try {
      await manageAllergensUseCase.save(newAllergenName, true);
      setNewAllergenName('');
      await loadAllergens();
      Alert.alert('成功', 'アレルゲンを追加しました');
    } catch (error) {
      Alert.alert('エラー', 'アレルゲンの追加に失敗しました');
    }
  };

  const handleAddPreset = async (name: string) => {
    try {
      await manageAllergensUseCase.save(name, true);
      await loadAllergens();
      Alert.alert('成功', `${name}を追加しました`);
    } catch (error) {
      Alert.alert('エラー', 'アレルゲンの追加に失敗しました');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    Alert.alert(
      '確認',
      `${name}を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await manageAllergensUseCase.delete(id);
              await loadAllergens();
            } catch (error) {
              Alert.alert('エラー', 'アレルゲンの削除に失敗しました');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>アレルゲン管理</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>新しいアレルゲンを追加</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="アレルゲン名"
            value={newAllergenName}
            onChangeText={setNewAllergenName}
          />
          <Button title="追加" onPress={handleAdd} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>よくあるアレルゲン</Text>
        <View style={styles.presetContainer}>
          {commonAllergens.map((name, index) => (
            <TouchableOpacity
              key={index}
              style={styles.presetButton}
              onPress={() => handleAddPreset(name)}>
              <Text style={styles.presetButtonText}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>登録済みアレルゲン</Text>
        <FlatList
          data={allergens}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text
                  style={[
                    styles.itemStatus,
                    item.enabled ? styles.enabled : styles.disabled,
                  ]}>
                  {item.enabled ? '有効' : '無効'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.name)}>
                <Text style={styles.deleteButtonText}>削除</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              アレルゲンが登録されていません
            </Text>
          }
        />
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  presetButtonText: {
    color: '#2196F3',
    fontSize: 14,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    flex: 1,
  },
  itemStatus: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  enabled: {
    backgroundColor: '#e8f5e9',
    color: '#4caf50',
  },
  disabled: {
    backgroundColor: '#fce4ec',
    color: '#e91e63',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
});
