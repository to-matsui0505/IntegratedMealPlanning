import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { InputCameraScreen } from './InputCameraScreen';
import { CameraDevice } from '../../interfaces/camera/CameraDevice';
import { AnalyzeImageUseCase } from '../../application/AnalyzeImageUseCase';
import { AddItemUseCase } from '../../application/AddItemUseCase';
import { AIImageAnalyzer } from '../../infrastructure/api/AIImageAnalyzer';
import { FridgeRepositoryImpl } from '../../infrastructure/database/FridgeRepositoryImpl';
import { ImageTempStore } from '../../infrastructure/storage/ImageTempStore';

export const InputScreen: React.FC = () => {
  const [showCameraInput, setShowCameraInput] = useState(false);

  // Initialize dependencies
  const cameraDevice = new CameraDevice();
  const aiImageAnalyzer = new AIImageAnalyzer();
  const fridgeRepository = new FridgeRepositoryImpl();
  const imageTempStore = new ImageTempStore();
  const analyzeImageUseCase = new AnalyzeImageUseCase(aiImageAnalyzer);
  const addItemUseCase = new AddItemUseCase(fridgeRepository);

  if (showCameraInput) {
    return (
      <InputCameraScreen
        cameraDevice={cameraDevice}
        analyzeImageUseCase={analyzeImageUseCase}
        addItemUseCase={addItemUseCase}
        imageTempStore={imageTempStore}
        onComplete={() => setShowCameraInput(false)}
        onCancel={() => setShowCameraInput(false)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>食材登録</Text>
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
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
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
