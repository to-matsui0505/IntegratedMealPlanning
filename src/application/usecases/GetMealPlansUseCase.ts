import { MealPlan } from '../../domain/entities/MealPlan';
import { MealPlanRepository } from '../../domain/repositories/MealPlanRepository';

/**
 * 献立一覧取得ユースケース
 */
export class GetMealPlansUseCase {
  constructor(private readonly mealPlanRepository: MealPlanRepository) {}

  async execute(startDate?: Date, endDate?: Date): Promise<MealPlan[]> {
    if (startDate && endDate) {
      return await this.mealPlanRepository.findByDateRange(startDate, endDate);
    }
    return await this.mealPlanRepository.findAll();
  }
}
