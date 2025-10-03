import { MealPlan } from '../domain/entities/MealPlan';
import { MealPlanRepository } from '../domain/repositories/MealPlanRepository';

export class GetMealPlanUseCase {
  constructor(private mealPlanRepository: MealPlanRepository) {}

  async execute(): Promise<MealPlan[]> {
    return await this.mealPlanRepository.findAll();
  }
}
