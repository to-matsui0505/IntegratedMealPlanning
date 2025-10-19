import { MealPlan } from '@/src/domain/entities/MealPlan';
import { MealPlanRepository } from '@/src/domain/repositories/MealPlanRepository';

/**
 * 献立取得ユースケース
 * 保存された献立計画を取得する
 */
export class GetMealPlanUseCase {
  constructor(private mealPlanRepository: MealPlanRepository) {}

  /**
   * すべての献立計画を取得する
   * @returns 献立計画のリスト
   */
  async execute(): Promise<MealPlan[]> {
    return await this.mealPlanRepository.findAll();
  }
}
