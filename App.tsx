import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { DashboardScreen } from './src/presentation/screens/DashboardScreen';
import { InputScreen } from './src/presentation/screens/InputScreen';
import { HistoryScreen } from './src/presentation/screens/HistoryScreen';
import { MealPlanCreateScreen } from './src/presentation/screens/MealPlanCreateScreen';
import { MealPlanListScreen } from './src/presentation/screens/MealPlanListScreen';
import { MealPlanDetailScreen } from './src/presentation/screens/MealPlanDetailScreen';
import { AllergenManagementScreen } from './src/presentation/screens/AllergenManagementScreen';

// Use Cases
import { AddItemUseCase } from './src/application/usecases/AddItemUseCase';
import { GetCurrentItemsUseCase } from './src/application/usecases/GetCurrentItemsUseCase';
import { GetHistoryUseCase } from './src/application/usecases/GetHistoryUseCase';
import { AnalyzeImageUseCase } from './src/application/usecases/AnalyzeImageUseCase';
import { GenerateMealPlanUseCase } from './src/application/usecases/GenerateMealPlanUseCase';
import { GetMealPlansUseCase } from './src/application/usecases/GetMealPlansUseCase';
import { GetMealPlanDetailUseCase } from './src/application/usecases/GetMealPlanDetailUseCase';
import { ManageAllergensUseCase } from './src/application/usecases/ManageAllergensUseCase';

// Repositories
import { SQLiteFridgeRepository } from './src/infrastructure/database/SQLiteFridgeRepository';
import { SQLiteHistoryRepository } from './src/infrastructure/database/SQLiteHistoryRepository';
import { SQLiteMealPlanRepository } from './src/infrastructure/database/SQLiteMealPlanRepository';
import { SQLiteAllergenRepository } from './src/infrastructure/database/SQLiteAllergenRepository';

// Services
import { AIImageAnalyzer } from './src/infrastructure/services/AIImageAnalyzer';
import { AIMealPlanGenerator } from './src/infrastructure/services/AIMealPlanGenerator';

// Interfaces
import { CameraDeviceImpl } from './src/interfaces/camera/CameraDevice';
import { ReceiptScannerImpl } from './src/interfaces/scanner/ReceiptScanner';

// Entities
import { MealPlan } from './src/domain/entities/MealPlan';

// Initialize repositories
const fridgeRepository = new SQLiteFridgeRepository();
const historyRepository = new SQLiteHistoryRepository();
const mealPlanRepository = new SQLiteMealPlanRepository();
const allergenRepository = new SQLiteAllergenRepository();

// Initialize services
const cameraDevice = new CameraDeviceImpl();
const receiptScanner = new ReceiptScannerImpl();
const aiImageAnalyzer = new AIImageAnalyzer(cameraDevice, receiptScanner);
const aiMealPlanGenerator = new AIMealPlanGenerator();

// Initialize use cases
const addItemUseCase = new AddItemUseCase(fridgeRepository);
const getCurrentItemsUseCase = new GetCurrentItemsUseCase(fridgeRepository);
const getHistoryUseCase = new GetHistoryUseCase(historyRepository);
const analyzeImageUseCase = new AnalyzeImageUseCase(aiImageAnalyzer);
const generateMealPlanUseCase = new GenerateMealPlanUseCase(
  mealPlanRepository,
  fridgeRepository,
  allergenRepository,
  aiMealPlanGenerator,
);
const getMealPlansUseCase = new GetMealPlansUseCase(mealPlanRepository);
const getMealPlanDetailUseCase = new GetMealPlanDetailUseCase(mealPlanRepository);
const manageAllergensUseCase = new ManageAllergensUseCase(allergenRepository);

type Screen = 'dashboard' | 'input' | 'history' | 'mealPlanCreate' | 'mealPlanList' | 'mealPlanDetail' | 'allergenManagement';

/**
 * メインアプリケーションコンポーネント
 */
const App = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);

  const handleSelectMealPlan = (plan: MealPlan) => {
    setSelectedMealPlan(plan);
    setCurrentScreen('mealPlanDetail');
  };

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
      case 'mealPlanCreate':
        return <MealPlanCreateScreen generateMealPlanUseCase={generateMealPlanUseCase} />;
      case 'mealPlanList':
        return (
          <MealPlanListScreen
            getMealPlansUseCase={getMealPlansUseCase}
            onSelectPlan={handleSelectMealPlan}
          />
        );
      case 'mealPlanDetail':
        return selectedMealPlan ? (
          <MealPlanDetailScreen mealPlan={selectedMealPlan} />
        ) : (
          <Text>献立が選択されていません</Text>
        );
      case 'allergenManagement':
        return <AllergenManagementScreen manageAllergensUseCase={manageAllergensUseCase} />;
      default:
        return <DashboardScreen getCurrentItemsUseCase={getCurrentItemsUseCase} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      <ScrollView 
        horizontal 
        style={styles.navigation}
        showsHorizontalScrollIndicator={false}>
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
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === 'mealPlanCreate' && styles.navButtonActive,
          ]}
          onPress={() => setCurrentScreen('mealPlanCreate')}>
          <Text
            style={[
              styles.navButtonText,
              currentScreen === 'mealPlanCreate' && styles.navButtonTextActive,
            ]}>
            献立作成
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === 'mealPlanList' && styles.navButtonActive,
          ]}
          onPress={() => setCurrentScreen('mealPlanList')}>
          <Text
            style={[
              styles.navButtonText,
              currentScreen === 'mealPlanList' && styles.navButtonTextActive,
            ]}>
            献立一覧
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentScreen === 'allergenManagement' && styles.navButtonActive,
          ]}
          onPress={() => setCurrentScreen('allergenManagement')}>
          <Text
            style={[
              styles.navButtonText,
              currentScreen === 'allergenManagement' && styles.navButtonTextActive,
            ]}>
            アレルゲン
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: 16,
    alignItems: 'center',
    minWidth: 100,
  },
  navButtonActive: {
    backgroundColor: '#f0f0f0',
  },
  navButtonText: {
    fontSize: 12,
    color: '#666',
  },
  navButtonTextActive: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default App;
