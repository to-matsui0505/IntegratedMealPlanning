import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { InputCameraScreen } from './InputCameraScreen';
import { CameraDevice } from '../../interfaces/camera/CameraDevice';
import { AnalyzeImageUseCase } from '../../application/AnalyzeImageUseCase';
import { AddItemUseCase } from '../../application/AddItemUseCase';
import { AIImageAnalyzer } from '../../infrastructure/api/AIImageAnalyzer';
import { FridgeRepositoryImpl } from '../../infrastructure/database/FridgeRepositoryImpl';
import { ImageTempStore } from '../../infrastructure/storage/ImageTempStore';

interface InputScreenProps {
  onNavigateBack?: () => void;
}

export const InputScreen: React.FC<InputScreenProps> = ({ onNavigateBack }) => {
  const [showCameraInput, setShowCameraInput] = useState(false);

  // Initialize dependencies
  const cameraDevice = new CameraDevice();
  const aiImageAnalyzer = new AIImageAnalyzer();
  const fridgeRepository = new FridgeRepositoryImpl();
  const imageTempStore = new ImageTempStore();
  const analyzeImageUseCase = new AnalyzeImageUseCase(aiImageAnalyzer);
  const addItemUseCase = new AddItemUseCase(fridgeRepository);

  const handleComplete = () => {
    setShowCameraInput(false);
    if (onNavigateBack) {
      onNavigateBack();
    }
  };

  const handleCancel = () => {
    setShowCameraInput(false);
  };

  if (showCameraInput) {
    return (
      <InputCameraScreen
        cameraDevice={cameraDevice}
        analyzeImageUseCase={analyzeImageUseCase}
        addItemUseCase={addItemUseCase}
        imageTempStore={imageTempStore}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.title}>食材登録</Text>
        <View style={styles.placeholder} />
      </View>
      <Text style={styles.subtitle}>登録方法を選択してください</Text>

      <TouchableOpacity
        style={styles.methodButton}
        onPress={() => setShowCameraInput(true)}>
        <Text style={styles.methodIcon}>📷</Text>
        <Text style={styles.methodTitle}>方法① カメラ撮影</Text>
        <Text style={styles.methodDescription}>
          食材を撮影してAIで自動認識
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.methodButton, styles.disabledButton]}>
        <Text style={styles.methodIcon}>🧾</Text>
        <Text style={styles.methodTitle}>方法② レシート撮影</Text>
        <Text style={styles.methodDescription}>準備中</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.methodButton, styles.disabledButton]}>
        <Text style={styles.methodIcon}>✍️</Text>
        <Text style={styles.methodTitle}>方法③ 手入力</Text>
        <Text style={styles.methodDescription}>準備中</Text>
      </TouchableOpacity>
    </View>
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
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  placeholder: {
    width: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    margin: 16,
    marginTop: 8,
  },
  methodButton: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  methodIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#666',
  },
});
