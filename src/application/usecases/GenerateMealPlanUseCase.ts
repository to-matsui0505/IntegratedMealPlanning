import { MealPlanRepository } from '../../domain/repositories/MealPlanRepository';
import { FridgeRepository } from '../../domain/repositories/FridgeRepository';
import { AllergenRepository } from '../../domain/repositories/AllergenRepository';
import { AIMealPlanGenerator } from '../../infrastructure/services/AIMealPlanGenerator';
import { MealPlan } from '../../domain/entities/MealPlan';

/**
 * 献立生成リクエスト
 */
export interface GenerateMealPlanRequest {
  startDate: Date;
  endDate: Date;
  maxBudget?: number;
}

/**
 * 献立生成ユースケース
 */
export class GenerateMealPlanUseCase {
  constructor(
    private readonly mealPlanRepository: MealPlanRepository,
    private readonly fridgeRepository: FridgeRepository,
    private readonly allergenRepository: AllergenRepository,
    private readonly aiMealPlanGenerator: AIMealPlanGenerator,
  ) {}

  async execute(request: GenerateMealPlanRequest): Promise<MealPlan[]> {
    // 冷蔵庫の中身を取得
    const fridgeItems = await this.fridgeRepository.findAll();

    // 有効なアレルゲン情報を取得
    const allergens = await this.allergenRepository.findEnabled();

    // AIで献立を生成
    const mealPlans = await this.aiMealPlanGenerator.generate({
      startDate: request.startDate,
      endDate: request.endDate,
      fridgeItems,
      allergens,
      maxBudget: request.maxBudget,
    });

    // 生成した献立を保存
    for (const plan of mealPlans) {
      await this.mealPlanRepository.save(plan);
    }

    return mealPlans;
  }
}
