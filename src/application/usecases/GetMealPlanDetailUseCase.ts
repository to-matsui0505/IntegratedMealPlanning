import { MealPlan } from '../../domain/entities/MealPlan';
import { MealPlanRepository } from '../../domain/repositories/MealPlanRepository';

/**
 * 献立詳細取得ユースケース
 */
export class GetMealPlanDetailUseCase {
  constructor(private readonly mealPlanRepository: MealPlanRepository) {}

  async execute(id: string): Promise<MealPlan | null> {
    return await this.mealPlanRepository.findById(id);
  }
}
