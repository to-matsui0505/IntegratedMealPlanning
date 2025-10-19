import { FridgeRepository } from '@/src/domain/repositories/FridgeRepository';
import { MealPlanRepository } from '@/src/domain/repositories/MealPlanRepository';
import { HistoryRepository } from '@/src/domain/repositories/HistoryRepository';
import { InMemoryFridgeRepository } from '@/src/infrastructure/repositories/InMemoryFridgeRepository';
import { InMemoryMealPlanRepository } from '@/src/infrastructure/repositories/InMemoryMealPlanRepository';
import { InMemoryHistoryRepository } from '@/src/infrastructure/repositories/InMemoryHistoryRepository';
import { MockAIImageAnalyzer } from '@/src/infrastructure/external-services/MockAIImageAnalyzer';
import { MockAIMealPlanGenerator } from '@/src/infrastructure/external-services/MockAIMealPlanGenerator';
import {
  AIImageAnalyzer,
  AnalyzeImageUseCase,
} from '@/src/application/use-cases/AnalyzeImageUseCase';
import {
  AIMealPlanGenerator,
  CreateMealPlanUseCase,
} from '@/src/application/use-cases/CreateMealPlanUseCase';
import { AddItemUseCase } from '@/src/application/use-cases/AddItemUseCase';
import { RemoveItemUseCase } from '@/src/application/use-cases/RemoveItemUseCase';
import { GetCurrentItemsUseCase } from '@/src/application/use-cases/GetCurrentItemsUseCase';
import { GetHistoryUseCase } from '@/src/application/use-cases/GetHistoryUseCase';
import { GetMealPlanUseCase } from '@/src/application/use-cases/GetMealPlanUseCase';
import { GetMealPlanDetailUseCase } from '@/src/application/use-cases/GetMealPlanDetailUseCase';

/**
 * 依存性注入コンテナ
 * アプリケーション全体の依存関係を管理し、Clean Architectureの原則を維持
 */
class DIContainer {
  private static instance: DIContainer;

  // リポジトリのシングルトンインスタンス
  private fridgeRepository: FridgeRepository;
  private mealPlanRepository: MealPlanRepository;
  private historyRepository: HistoryRepository;

  // 外部サービスのシングルトンインスタンス
  private aiImageAnalyzer: AIImageAnalyzer;
  private aiMealPlanGenerator: AIMealPlanGenerator;

  private constructor() {
    // リポジトリの初期化（将来的にSQLite実装に置き換え可能）
    this.fridgeRepository = new InMemoryFridgeRepository();
    this.mealPlanRepository = new InMemoryMealPlanRepository();
    this.historyRepository = new InMemoryHistoryRepository();

    // 外部サービスの初期化（将来的に実際のAI APIに置き換え可能）
    this.aiImageAnalyzer = new MockAIImageAnalyzer();
    this.aiMealPlanGenerator = new MockAIMealPlanGenerator();
  }

  /**
   * DIContainerのシングルトンインスタンスを取得
   */
  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * AddItemUseCaseのインスタンスを取得
   */
  getAddItemUseCase(): AddItemUseCase {
    return new AddItemUseCase(this.fridgeRepository);
  }

  /**
   * RemoveItemUseCaseのインスタンスを取得
   */
  getRemoveItemUseCase(): RemoveItemUseCase {
    return new RemoveItemUseCase(this.fridgeRepository);
  }

  /**
   * GetCurrentItemsUseCaseのインスタンスを取得
   */
  getGetCurrentItemsUseCase(): GetCurrentItemsUseCase {
    return new GetCurrentItemsUseCase(this.fridgeRepository);
  }

  /**
   * GetHistoryUseCaseのインスタンスを取得
   */
  getGetHistoryUseCase(): GetHistoryUseCase {
    return new GetHistoryUseCase(this.historyRepository);
  }

  /**
   * AnalyzeImageUseCaseのインスタンスを取得
   */
  getAnalyzeImageUseCase(): AnalyzeImageUseCase {
    return new AnalyzeImageUseCase(this.aiImageAnalyzer);
  }

  /**
   * CreateMealPlanUseCaseのインスタンスを取得
   */
  getCreateMealPlanUseCase(): CreateMealPlanUseCase {
    return new CreateMealPlanUseCase(
      this.fridgeRepository,
      this.mealPlanRepository,
      this.aiMealPlanGenerator
    );
  }

  /**
   * GetMealPlanUseCaseのインスタンスを取得
   */
  getGetMealPlanUseCase(): GetMealPlanUseCase {
    return new GetMealPlanUseCase(this.mealPlanRepository);
  }

  /**
   * GetMealPlanDetailUseCaseのインスタンスを取得
   */
  getGetMealPlanDetailUseCase(): GetMealPlanDetailUseCase {
    return new GetMealPlanDetailUseCase(this.mealPlanRepository);
  }
}

/**
 * DIContainerのシングルトンインスタンスをエクスポート
 */
export const diContainer = DIContainer.getInstance();
