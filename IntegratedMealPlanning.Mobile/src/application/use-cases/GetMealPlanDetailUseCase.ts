import { MealPlan } from '@/src/domain/entities/MealPlan';
import { MealPlanRepository } from '@/src/domain/repositories/MealPlanRepository';

/**
 * 献立詳細取得ユースケース
 * 特定の献立計画の詳細を取得する
 */
export class GetMealPlanDetailUseCase {
  constructor(private mealPlanRepository: MealPlanRepository) {}

  /**
   * 献立計画の詳細を取得する
   * @param id 献立計画ID
   * @returns 献立計画またはnull
   */
  async execute(id: string): Promise<MealPlan | null> {
    if (!id || id.trim() === '') {
      throw new Error('献立計画IDが指定されていません');
    }

    return await this.mealPlanRepository.findById(id);
  }
}
