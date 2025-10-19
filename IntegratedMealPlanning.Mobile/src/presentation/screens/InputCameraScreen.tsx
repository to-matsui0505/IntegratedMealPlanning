import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  View,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { FridgeItem, ItemType } from '@/src/domain/entities/FridgeItem';
import { diContainer } from '@/src/infrastructure/di/DIContainer';

/**
 * 編集可能な食材アイテム
 */
interface EditableItem {
  id: string;
  category: string;
  subCategory: string;
  name: string;
  quantity: string;
  unit: string;
  confidence: number;
}

/**
 * 入力画面（カメラ撮影）
 * 食材をカメラで撮影してAI解析し、登録する
 */
export default function InputCameraScreen({ onClose }: { onClose?: () => void }) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [items, setItems] = useState<EditableItem[]>([]);
  const [showContinueDialog, setShowContinueDialog] = useState(false);

  const cameraDevice = diContainer.getCameraDevice();

  /**
   * カメラで撮影
   */
  const handleTakePicture = async () => {
    try {
      const uri = await cameraDevice.takePicture();
      if (uri) {
        setImageUri(uri);
        await analyzeImage(uri);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('エラー', error.message);
      } else {
        Alert.alert('エラー', 'カメラの起動に失敗しました');
      }
    }
  };

  /**
   * ギャラリーから画像を選択
   */
  const handlePickImage = async () => {
    try {
      const uri = await cameraDevice.pickImage();
      if (uri) {
        setImageUri(uri);
        await analyzeImage(uri);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('エラー', error.message);
      } else {
        Alert.alert('エラー', '画像の選択に失敗しました');
      }
    }
  };

  /**
   * 画像をAI解析
   */
  const analyzeImage = async (uri: string) => {
    setIsAnalyzing(true);
    try {
      const useCase = diContainer.getAnalyzeImageUseCase();
      const result = await useCase.execute(uri);

      // 解析結果を編集可能な形式に変換
      const editableItems: EditableItem[] = result.items.map((item, index) => ({
        id: `temp-${Date.now()}-${index}`,
        category: item.category,
        subCategory: item.subCategory,
        name: item.name,
        quantity: item.quantity.toString(),
        unit: item.unit,
        confidence: item.confidence,
      }));

      setItems(editableItems);
    } catch (error) {
      Alert.alert('エラー', error instanceof Error ? error.message : '画像の解析に失敗しました');
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * アイテムのフィールドを更新
   */
  const updateItem = (id: string, field: keyof EditableItem, value: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  /**
   * アイテムを削除
   */
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  /**
   * アイテムを追加
   */
  const addNewItem = () => {
    const newItem: EditableItem = {
      id: `temp-${Date.now()}`,
      category: '',
      subCategory: '',
      name: '',
      quantity: '1',
      unit: '個',
      confidence: 1.0,
    };
    setItems([...items, newItem]);
  };

  /**
   * 確定してデータベースに保存
   */
  const handleConfirm = async () => {
    try {
      // バリデーション
      for (const item of items) {
        if (!item.name.trim()) {
          Alert.alert('エラー', 'すべてのアイテムに名称を入力してください');
          return;
        }
        const quantity = parseFloat(item.quantity);
        if (isNaN(quantity) || quantity <= 0) {
          Alert.alert('エラー', `${item.name}の数量が不正です`);
          return;
        }
      }

      // FridgeItemに変換
      const fridgeItems: FridgeItem[] = items.map((item) => ({
        id: `item-${Date.now()}-${Math.random()}`,
        type: ItemType.INBOUND,
        category: item.category,
        subCategory: item.subCategory,
        name: item.name,
        quantity: parseFloat(item.quantity),
        unit: item.unit,
        updatedAt: new Date(),
      }));

      // 一括保存
      const useCase = diContainer.getAddItemUseCase();
      await useCase.executeBatch(fridgeItems);

      Alert.alert('成功', `${items.length}件のアイテムを追加しました`);

      // 連続入力確認ダイアログを表示
      setShowContinueDialog(true);
    } catch (error) {
      Alert.alert('エラー', error instanceof Error ? error.message : '保存に失敗しました');
    }
  };

  /**
   * 連続入力を継続
   */
  const handleContinue = () => {
    setShowContinueDialog(false);
    setImageUri(null);
    setItems([]);
  };

  /**
   * ダッシュボードに戻る
   */
  const handleFinish = () => {
    setShowContinueDialog(false);
    if (onClose) {
      onClose();
    }
  };

  /**
   * 再撮影
   */
  const handleRetake = () => {
    setImageUri(null);
    setItems([]);
  };

  // 連続入力確認ダイアログ
  if (showContinueDialog) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.dialogContainer}>
          <ThemedText type="title" style={styles.dialogTitle}>
            保存完了
          </ThemedText>
          <ThemedText style={styles.dialogText}>
            続けて入力しますか？
          </ThemedText>
          <View style={styles.dialogButtons}>
            <Button title="はい" onPress={handleContinue} />
            <View style={styles.buttonSpacer} />
            <Button title="いいえ" onPress={handleFinish} />
          </View>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText type="title" style={styles.title}>
          食材撮影入力
        </ThemedText>

        {/* 撮影・選択ボタン */}
        {!imageUri && (
          <View style={styles.buttonContainer}>
            <Button title="カメラで撮影" onPress={handleTakePicture} />
            <View style={styles.buttonSpacer} />
            <Button title="ギャラリーから選択" onPress={handlePickImage} />
          </View>
        )}

        {/* 画像プレビュー */}
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </View>
        )}

        {/* 解析中インジケーター */}
        {isAnalyzing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <ThemedText style={styles.loadingText}>
              画像を解析中...
            </ThemedText>
          </View>
        )}

        {/* 解析結果リスト */}
        {!isAnalyzing && items.length > 0 && (
          <View style={styles.itemsContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              解析結果（編集可能）
            </ThemedText>

            {items.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.itemCard,
                  item.confidence < 0.6 && styles.lowConfidenceCard,
                ]}
              >
                <View style={styles.itemHeader}>
                  <ThemedText type="defaultSemiBold">
                    アイテム {index + 1}
                  </ThemedText>
                  {item.confidence < 0.6 && (
                    <ThemedText style={styles.confidenceWarning}>
                      （要確認）
                    </ThemedText>
                  )}
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => removeItem(item.id)}
                  >
                    <ThemedText style={styles.deleteButtonText}>
                      削除
                    </ThemedText>
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <ThemedText>名称 *</ThemedText>
                  <TextInput
                    style={styles.input}
                    value={item.name}
                    onChangeText={(value) => updateItem(item.id, 'name', value)}
                    placeholder="例: レタス"
                  />
                </View>

                <View style={styles.formGroup}>
                  <ThemedText>大分類</ThemedText>
                  <TextInput
                    style={styles.input}
                    value={item.category}
                    onChangeText={(value) => updateItem(item.id, 'category', value)}
                    placeholder="例: 野菜類"
                  />
                </View>

                <View style={styles.formGroup}>
                  <ThemedText>小分類</ThemedText>
                  <TextInput
                    style={styles.input}
                    value={item.subCategory}
                    onChangeText={(value) => updateItem(item.id, 'subCategory', value)}
                    placeholder="例: 葉物野菜"
                  />
                </View>

                <View style={styles.rowGroup}>
                  <View style={styles.halfWidth}>
                    <ThemedText>数量 *</ThemedText>
                    <TextInput
                      style={styles.input}
                      value={item.quantity}
                      onChangeText={(value) => updateItem(item.id, 'quantity', value)}
                      placeholder="1"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <ThemedText>単位</ThemedText>
                    <TextInput
                      style={styles.input}
                      value={item.unit}
                      onChangeText={(value) => updateItem(item.id, 'unit', value)}
                      placeholder="個"
                    />
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.buttonContainer}>
              <Button title="アイテムを追加" onPress={addNewItem} />
            </View>
          </View>
        )}

        {/* アクションボタン */}
        {imageUri && !isAnalyzing && items.length > 0 && (
          <View style={styles.actionButtons}>
            <Button title="確定" onPress={handleConfirm} />
            <View style={styles.buttonSpacer} />
            <Button title="再撮影" onPress={handleRetake} />
          </View>
        )}

        {imageUri && !isAnalyzing && items.length === 0 && (
          <View style={styles.actionButtons}>
            <ThemedText style={styles.noItemsText}>
              食材が検出されませんでした
            </ThemedText>
            <Button title="再撮影" onPress={handleRetake} />
          </View>
        )}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  buttonSpacer: {
    width: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  loadingText: {
    marginTop: 16,
  },
  itemsContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  lowConfidenceCard: {
    borderColor: '#ff9800',
    backgroundColor: '#fff3e0',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  confidenceWarning: {
    color: '#ff9800',
    marginLeft: 8,
  },
  deleteButton: {
    marginLeft: 'auto',
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
  },
  formGroup: {
    marginBottom: 12,
  },
  rowGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    backgroundColor: 'white',
  },
  actionButtons: {
    marginTop: 24,
    marginBottom: 32,
  },
  noItemsText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  dialogContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  dialogTitle: {
    marginBottom: 16,
  },
  dialogText: {
    marginBottom: 32,
    textAlign: 'center',
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
