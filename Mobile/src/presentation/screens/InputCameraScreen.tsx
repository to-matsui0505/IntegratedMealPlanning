import React, { useState, useRef } from 'react';
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
  Linking,
} from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { CameraDevice } from '../../interfaces/camera/CameraDevice';
import { AnalyzeImageUseCase } from '../../application/AnalyzeImageUseCase';
import { AddItemUseCase } from '../../application/AddItemUseCase';
import { FridgeItem } from '../../domain/entities/FridgeItem';
import { ImageTempStore } from '../../infrastructure/storage/ImageTempStore';
import { Picker } from '../components/Picker';

interface EditableItem extends FridgeItem {
  confidence?: number;
}

// 大分類の選択肢
const CATEGORIES = [
  '野菜類',
  '肉類',
  '魚介類',
  '乳製品',
  '調味料',
  '飲料',
  '果物',
  '穀類',
  '卵',
  '豆類',
  '加工食品',
  'その他',
];

// 小分類の選択肢（大分類に応じて変更可能）
const SUB_CATEGORIES: { [key: string]: string[] } = {
  野菜類: ['葉物', '根菜', 'きのこ類', 'その他'],
  肉類: ['牛肉', '豚肉', '鶏肉', 'ひき肉', 'その他'],
  魚介類: ['魚', '貝類', '海藻', 'その他'],
  乳製品: ['牛乳', 'チーズ', 'ヨーグルト', 'バター', 'その他'],
  調味料: ['液体調味料', '粉末調味料', '油類', 'その他'],
  飲料: ['水', 'お茶', 'ジュース', 'その他'],
  果物: ['柑橘類', 'りんご・梨', 'ベリー類', 'その他'],
  穀類: ['米', 'パン', '麺類', 'その他'],
  卵: ['鶏卵', 'その他'],
  豆類: ['大豆', '豆腐', '納豆', 'その他'],
  加工食品: ['冷凍食品', 'レトルト', '缶詰', 'その他'],
  その他: ['その他'],
};

// 単位の選択肢
const UNITS = [
  'g',
  'kg',
  'ml',
  'L',
  '個',
  '本',
  '枚',
  '束',
  'パック',
  '袋',
  '缶',
  '瓶',
  '箱',
  'その他',
];

interface InputCameraScreenProps {
  cameraDevice: CameraDevice;
  analyzeImageUseCase: AnalyzeImageUseCase;
  addItemUseCase: AddItemUseCase;
  imageTempStore: ImageTempStore;
  onComplete: () => void;
  onCancel: () => void;
}

export const InputCameraScreen: React.FC<InputCameraScreenProps> = ({
  cameraDevice: _cameraDevice,
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
  const [showCamera, setShowCamera] = useState(false);
  
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);

  const handleOpenCamera = async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          'カメラ権限が必要です',
          'カメラを使用するには設定から権限を許可してください。',
          [
            { text: 'キャンセル', style: 'cancel' },
            { text: '設定を開く', onPress: () => Linking.openSettings() },
          ],
        );
        return;
      }
    }
    setShowCamera(true);
  };

  const handleCapture = async () => {
    try {
      if (!camera.current) {
        throw new Error('Camera not initialized');
      }

      const photo = await camera.current.takePhoto({
        flash: 'off',
        enableShutterSound: true,
      });

      const imagePath = `file://${photo.path}`;
      setCapturedImagePath(imagePath);
      setShowCamera(false);

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
    setShowCamera(true);
  };

  // Show camera view when in capture mode
  if (showCamera) {
    if (!device) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>食材撮影</Text>
            <TouchableOpacity onPress={() => { setShowCamera(false); onCancel(); }}>
              <Text style={styles.cancelButton}>✕ 戻る</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.errorSection}>
            <Text style={styles.errorText}>カメラデバイスが見つかりません</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={showCamera}
          photo={true}
        />
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.cancelCameraButton}
            onPress={() => setShowCamera(false)}>
            <Text style={styles.cancelCameraButtonText}>✕ キャンセル</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.captureCircleButton}
            onPress={handleCapture}>
            <View style={styles.captureCircleInner} />
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
      </View>
    );
  }

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
            onPress={handleOpenCamera}>
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
          {analyzedItems.map((item, index) => {
            const subCategoryOptions =
              SUB_CATEGORIES[item.category] || SUB_CATEGORIES['その他'];
            
            return (
              <View key={index} style={styles.itemCard}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>大分類:</Text>
                  <Picker
                    value={item.category}
                    items={CATEGORIES}
                    onValueChange={text =>
                      handleItemEdit(index, 'category', text)
                    }
                    placeholder="選択してください"
                    style={styles.itemInput}
                  />
                </View>
                <View style={styles.itemRow}>
                  <Text style={styles.itemLabel}>小分類:</Text>
                  <Picker
                    value={item.subCategory}
                    items={subCategoryOptions}
                    onValueChange={text =>
                      handleItemEdit(index, 'subCategory', text)
                    }
                    placeholder="選択してください"
                    style={styles.itemInput}
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
                    style={styles.itemInputSmall}
                    value={String(item.quantity)}
                    keyboardType="numeric"
                    onChangeText={text =>
                      handleItemEdit(index, 'quantity', parseFloat(text) || 0)
                    }
                  />
                  <Picker
                    value={item.unit}
                    items={UNITS}
                    onValueChange={text => handleItemEdit(index, 'unit', text)}
                    placeholder="単位"
                    style={styles.itemInputSmall}
                  />
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteItem(index)}>
                  <Text style={styles.deleteButtonText}>削除</Text>
                </TouchableOpacity>
              </View>
            );
          })}
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
    marginRight: 8,
  },
  itemInputSmall: {
    flex: 1,
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
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 48,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cancelCameraButton: {
    padding: 12,
    width: 80,
  },
  cancelCameraButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  captureCircleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#007AFF',
  },
  captureCircleInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
  },
  placeholder: {
    width: 80,
  },
  errorSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
