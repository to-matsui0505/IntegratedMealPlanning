import { MealPlan } from '@/src/domain/entities/MealPlan';
import { FridgeRepository } from '@/src/domain/repositories/FridgeRepository';
import { MealPlanRepository } from '@/src/domain/repositories/MealPlanRepository';

/**
 * AI献立生成サービスのインターフェース
 */
export interface AIMealPlanGenerator {
  /**
   * 献立を生成する
   * @param ingredients 利用可能な食材リスト
   * @param startDate 開始日
   * @param endDate 終了日
   * @param allergens アレルゲンリスト
   * @returns 生成された献立計画
   */
  generateMealPlan(
    ingredients: string[],
    startDate: Date,
    endDate: Date,
    allergens: string[]
  ): Promise<MealPlan>;
}

/**
 * 献立作成ユースケース
 * 冷蔵庫の中身からAIを使って献立を作成する
 */
export class CreateMealPlanUseCase {
  constructor(
    private fridgeRepository: FridgeRepository,
    private mealPlanRepository: MealPlanRepository,
    private aiMealPlanGenerator: AIMealPlanGenerator
  ) {}

  /**
   * 献立を作成する
   * @param startDate 開始日
   * @param endDate 終了日
   * @param allergens アレルゲンリスト
   * @returns 作成された献立計画
   */
  async execute(startDate: Date, endDate: Date, allergens: string[]): Promise<MealPlan> {
    // 期間の検証
    if (startDate > endDate) {
      throw new Error('開始日は終了日より前である必要があります');
    }

    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 31) {
      throw new Error('献立作成期間は最大31日です');
    }

    // 冷蔵庫の中身を取得
    const fridgeItems = await this.fridgeRepository.findAll();
    const ingredients = fridgeItems.map((item) => item.name);

    // AI献立生成
    const mealPlan = await this.aiMealPlanGenerator.generateMealPlan(
      ingredients,
      startDate,
      endDate,
      allergens
    );

    // 献立を保存
    await this.mealPlanRepository.save(mealPlan);

    return mealPlan;
  }
}
