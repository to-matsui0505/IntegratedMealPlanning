import { FridgeRepository } from '@/src/domain/repositories/FridgeRepository';
import { MealPlanRepository } from '@/src/domain/repositories/MealPlanRepository';
import { HistoryRepository } from '@/src/domain/repositories/HistoryRepository';
import { ActivityRepository } from '@/src/domain/repositories/ActivityRepository';
import { ConfigRepository } from '@/src/domain/repositories/ConfigRepository';
import { InMemoryFridgeRepository } from '@/src/infrastructure/repositories/InMemoryFridgeRepository';
import { InMemoryMealPlanRepository } from '@/src/infrastructure/repositories/InMemoryMealPlanRepository';
import { InMemoryHistoryRepository } from '@/src/infrastructure/repositories/InMemoryHistoryRepository';
import { InMemoryActivityRepository } from '@/src/infrastructure/repositories/InMemoryActivityRepository';
import { InMemoryConfigRepository } from '@/src/infrastructure/repositories/InMemoryConfigRepository';
import { AzureOpenAIImageAnalyzer } from '@/src/infrastructure/external-services/AzureOpenAIImageAnalyzer';
import { MockAIMealPlanGenerator } from '@/src/infrastructure/external-services/MockAIMealPlanGenerator';
import {
  CameraDevice,
  ExpoCameraDevice,
} from '@/src/interfaces/devices/CameraDevice';
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
import { UpdateHistoryUseCase } from '@/src/application/use-cases/UpdateHistoryUseCase';
import { GetMealPlanUseCase } from '@/src/application/use-cases/GetMealPlanUseCase';
import { GetMealPlanDetailUseCase } from '@/src/application/use-cases/GetMealPlanDetailUseCase';
import { GetDashboardSummaryUseCase } from '@/src/application/use-cases/GetDashboardSummaryUseCase';
import { GetRecentActivitiesUseCase } from '@/src/application/use-cases/GetRecentActivitiesUseCase';

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
  private activityRepository: ActivityRepository;
  private configRepository: ConfigRepository;

  // 外部サービスのシングルトンインスタンス
  private aiImageAnalyzer: AIImageAnalyzer;
  private aiMealPlanGenerator: AIMealPlanGenerator;
  /** カメラデバイスのシングルトンインスタンス */
  private cameraDevice: CameraDevice;

  private constructor() {
    // リポジトリの初期化（将来的にSQLite実装に置き換え可能）
    this.fridgeRepository = new InMemoryFridgeRepository();
    this.mealPlanRepository = new InMemoryMealPlanRepository();
    this.historyRepository = new InMemoryHistoryRepository();
    this.activityRepository = new InMemoryActivityRepository();
    this.configRepository = new InMemoryConfigRepository();

    // 外部サービスの初期化
    // Azure OpenAI画像分析サービスを使用（設定が必要）
    this.aiImageAnalyzer = new AzureOpenAIImageAnalyzer(this.configRepository);
    this.aiMealPlanGenerator = new MockAIMealPlanGenerator();
    this.cameraDevice = new ExpoCameraDevice();
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
    return new AddItemUseCase(this.fridgeRepository, this.historyRepository);
  }

  /**
   * RemoveItemUseCaseのインスタンスを取得
   */
  getRemoveItemUseCase(): RemoveItemUseCase {
    return new RemoveItemUseCase(this.fridgeRepository, this.historyRepository);
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
   * UpdateHistoryUseCaseのインスタンスを取得
   */
  getUpdateHistoryUseCase(): UpdateHistoryUseCase {
    return new UpdateHistoryUseCase(this.historyRepository);
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

  /**
   * GetDashboardSummaryUseCaseのインスタンスを取得
   */
  getGetDashboardSummaryUseCase(): GetDashboardSummaryUseCase {
    return new GetDashboardSummaryUseCase(this.fridgeRepository);
  }

  /**
   * GetRecentActivitiesUseCaseのインスタンスを取得
   */
  getGetRecentActivitiesUseCase(): GetRecentActivitiesUseCase {
    return new GetRecentActivitiesUseCase(this.activityRepository);
  }

  /**
   * CameraDeviceのインスタンスを取得
   */
  getCameraDevice(): CameraDevice {
    return this.cameraDevice;
  }

  /**
   * ConfigRepositoryのインスタンスを取得
   */
  getConfigRepository(): ConfigRepository {
    return this.configRepository;
  }
}

/**
 * DIContainerのシングルトンインスタンスをエクスポート
 */
export const diContainer = DIContainer.getInstance();
