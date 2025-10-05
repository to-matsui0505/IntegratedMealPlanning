import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraDevice } from '../../interfaces/camera/CameraDevice';
import { AnalyzeImageUseCase } from '../../application/AnalyzeImageUseCase';
import { AddItemUseCase } from '../../application/AddItemUseCase';
import { FridgeItem } from '../../domain/entities/FridgeItem';
import { ImageTempStore } from '../../infrastructure/storage/ImageTempStore';

interface EditableItem extends FridgeItem {
  confidence?: number;
}

interface InputCameraScreenProps {
  cameraDevice: CameraDevice;
  analyzeImageUseCase: AnalyzeImageUseCase;
  addItemUseCase: AddItemUseCase;
  imageTempStore: ImageTempStore;
  onComplete: () => void;
  onCancel: () => void;
}

export const InputCameraScreen: React.FC<InputCameraScreenProps> = ({
  cameraDevice,
  analyzeImageUseCase,
  addItemUseCase,
  imageTempStore,
  onComplete,
  onCancel,
}) => {
  const [capturedImagePath, setCapturedImagePath] = useState<string | null>(
    null,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedItems, setAnalyzedItems] = useState<EditableItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleCapture = async () => {
    try {
      const hasPermission = await cameraDevice.checkPermission();
      if (!hasPermission.granted) {
        const granted = await cameraDevice.requestPermission();
        if (!granted) {
          Alert.alert(
            'カメラ権限が必要です',
            'カメラを使用するには設定から権限を許可してください。',
          );
          return;
        }
      }

      const imagePath = await cameraDevice.captureImage();
      setCapturedImagePath(imagePath);

      // Save to temporary storage
      const imageId = `img_${Date.now()}`;
      await imageTempStore.saveImage(imageId, 'user1', imagePath);

      // Analyze the image
      setIsAnalyzing(true);
      try {
        const items = await analyzeImageUseCase.execute(imagePath, imageId);
        setAnalyzedItems(items);
      } catch (error) {
        Alert.alert(
          '解析エラー',
          '画像解析に失敗しました。手動で入力するか、再撮影してください。',
        );
      } finally {
        setIsAnalyzing(false);
      }
    } catch (error) {
      Alert.alert('エラー', '撮影に失敗しました。');
      console.error('Camera capture error:', error);
    }
  };

  const handleItemEdit = (
    index: number,
    field: keyof FridgeItem,
    value: string | number,
  ) => {
    const updatedItems = [...analyzedItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setAnalyzedItems(updatedItems);
  };

  const handleDeleteItem = (index: number) => {
    setAnalyzedItems(analyzedItems.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (analyzedItems.length === 0) {
      Alert.alert('エラー', '保存する食材がありません。');
      return;
    }

    setIsSaving(true);
    try {
      for (const item of analyzedItems) {
        await addItemUseCase.execute(item);
      }

      // Cleanup temporary image
      if (capturedImagePath) {
        const imageId = capturedImagePath.split('/').pop()?.split('.')[0];
        if (imageId) {
          await imageTempStore.deleteImage(imageId);
        }
      }

      Alert.alert('保存完了', '食材を登録しました。', [
        {
          text: '続けて入力',
          onPress: () => {
            setCapturedImagePath(null);
            setAnalyzedItems([]);
          },
        },
        {
          text: 'ダッシュボードへ',
          onPress: onComplete,
        },
      ]);
    } catch (error) {
      Alert.alert('保存エラー', '食材の保存に失敗しました。');
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetake = () => {
    setCapturedImagePath(null);
    setAnalyzedItems([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>食材撮影</Text>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelButton}>✕ 戻る</Text>
        </TouchableOpacity>
      </View>

      {!capturedImagePath ? (
        <View style={styles.captureSection}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleCapture}>
            <Text style={styles.captureButtonText}>📷 撮影する</Text>
          </TouchableOpacity>
          <Text style={styles.helpText}>
            食材を撮影してAIで自動認識します
          </Text>
        </View>
      ) : (
        <View style={styles.previewSection}>
          <Image
            source={{ uri: capturedImagePath }}
            style={styles.previewImage}
          />
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
            <Text style={styles.retakeButtonText}>再撮影</Text>
          </TouchableOpacity>
        </View>
      )}

      {isAnalyzing && (
        <View style={styles.loadingSection}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>解析中...</Text>
        </View>
      )}

      {!isAnalyzing && analyzedItems.length > 0 && (
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>認識された食材</Text>
          {analyzedItems.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>大分類:</Text>
                <TextInput
                  style={styles.itemInput}
                  value={item.category}
                  onChangeText={text =>
                    handleItemEdit(index, 'category', text)
                  }
                />
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>小分類:</Text>
                <TextInput
                  style={styles.itemInput}
                  value={item.subCategory}
                  onChangeText={text =>
                    handleItemEdit(index, 'subCategory', text)
                  }
                />
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>名称:</Text>
                <TextInput
                  style={styles.itemInput}
                  value={item.name}
                  onChangeText={text => handleItemEdit(index, 'name', text)}
                />
              </View>
              <View style={styles.itemRow}>
                <Text style={styles.itemLabel}>数量:</Text>
                <TextInput
                  style={styles.itemInput}
                  value={String(item.quantity)}
                  keyboardType="numeric"
                  onChangeText={text =>
                    handleItemEdit(index, 'quantity', parseFloat(text) || 0)
                  }
                />
                <TextInput
                  style={styles.itemInput}
                  value={item.unit}
                  onChangeText={text => handleItemEdit(index, 'unit', text)}
                />
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteItem(index)}>
                <Text style={styles.deleteButtonText}>削除</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>確定して保存</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  captureSection: {
    padding: 32,
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
  },
  captureButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  previewSection: {
    padding: 16,
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  retakeButton: {
    backgroundColor: '#FF9500',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retakeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingSection: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  itemsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemLabel: {
    width: 80,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  itemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
