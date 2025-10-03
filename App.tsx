import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { DashboardScreen } from './src/presentation/screens/DashboardScreen';
import { InputScreen } from './src/presentation/screens/InputScreen';
import { HistoryScreen } from './src/presentation/screens/HistoryScreen';

// Use Cases
import { AddItemUseCase } from './src/application/usecases/AddItemUseCase';
import { GetCurrentItemsUseCase } from './src/application/usecases/GetCurrentItemsUseCase';
import { GetHistoryUseCase } from './src/application/usecases/GetHistoryUseCase';
import { AnalyzeImageUseCase } from './src/application/usecases/AnalyzeImageUseCase';

// Repositories
import { SQLiteFridgeRepository } from './src/infrastructure/database/SQLiteFridgeRepository';
import { SQLiteHistoryRepository } from './src/infrastructure/database/SQLiteHistoryRepository';

// Services
import { AIImageAnalyzer } from './src/infrastructure/services/AIImageAnalyzer';

// Interfaces
import { CameraDeviceImpl } from './src/interfaces/camera/CameraDevice';
import { ReceiptScannerImpl } from './src/interfaces/scanner/ReceiptScanner';

// Initialize repositories
const fridgeRepository = new SQLiteFridgeRepository();
const historyRepository = new SQLiteHistoryRepository();

// Initialize services
const cameraDevice = new CameraDeviceImpl();
const receiptScanner = new ReceiptScannerImpl();
const aiImageAnalyzer = new AIImageAnalyzer(cameraDevice, receiptScanner);

// Initialize use cases
const addItemUseCase = new AddItemUseCase(fridgeRepository);
const getCurrentItemsUseCase = new GetCurrentItemsUseCase(fridgeRepository);
const getHistoryUseCase = new GetHistoryUseCase(historyRepository);
const analyzeImageUseCase = new AnalyzeImageUseCase(aiImageAnalyzer);

type Screen = 'dashboard' | 'input' | 'history';

/**
 * メインアプリケーションコンポーネント
 */
const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen getCurrentItemsUseCase={getCurrentItemsUseCase} />;
      case 'input':
        return (
          <InputScreen
            addItemUseCase={addItemUseCase}
            analyzeImageUseCase={analyzeImageUseCase}
          />
        );
      case 'history':
        return <HistoryScreen getHistoryUseCase={getHistoryUseCase} />;
      default:
        return <DashboardScreen getCurrentItemsUseCase={getCurrentItemsUseCase} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === 'dashboard' && styles.navButtonActive,
          ]}
          onPress={() => setCurrentScreen('dashboard')}>
          <Text
            style={[
              styles.navButtonText,
              currentScreen === 'dashboard' && styles.navButtonTextActive,
            ]}>
            ダッシュボード
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === 'input' && styles.navButtonActive,
          ]}
          onPress={() => setCurrentScreen('input')}>
          <Text
            style={[
              styles.navButtonText,
              currentScreen === 'input' && styles.navButtonTextActive,
            ]}>
            登録
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === 'history' && styles.navButtonActive,
          ]}
          onPress={() => setCurrentScreen('history')}>
          <Text
            style={[
              styles.navButtonText,
              currentScreen === 'history' && styles.navButtonTextActive,
            ]}>
            履歴
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  navButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  navButtonActive: {
    backgroundColor: '#f0f0f0',
  },
  navButtonText: {
    fontSize: 14,
    color: '#666',
  },
  navButtonTextActive: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default App;
