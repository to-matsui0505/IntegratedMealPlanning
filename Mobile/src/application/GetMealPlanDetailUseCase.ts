import { MealPlan } from '../domain/entities/MealPlan';
import { MealPlanRepository } from '../domain/repositories/MealPlanRepository';

export class GetMealPlanDetailUseCase {
  constructor(private mealPlanRepository: MealPlanRepository) {}

  async execute(id: string): Promise<MealPlan | null> {
    return await this.mealPlanRepository.findById(id);
  }
}
