import { MealPlan } from '../domain/entities/MealPlan';
import { MealPlanRepository } from '../domain/repositories/MealPlanRepository';
import { FridgeRepository } from '../domain/repositories/FridgeRepository';

export class CreateMealPlanUseCase {
  constructor(
    private mealPlanRepository: MealPlanRepository,
    private fridgeRepository: FridgeRepository,
  ) {}

  async execute(
    startDate: Date,
    endDate: Date,
    allergens: string[],
  ): Promise<MealPlan> {
    // TODO: Implement AI meal plan generation logic
    await this.fridgeRepository.findAll();
    const mealPlan: MealPlan = {
      id: '',
      startDate,
      endDate,
      items: [],
      estimatedBudget: 0,
      allergens,
    };
    await this.mealPlanRepository.save(mealPlan);
    return mealPlan;
  }
}
