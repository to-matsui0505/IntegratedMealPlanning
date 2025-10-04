import { MealPlan } from '../../domain/entities/MealPlan';
import { FridgeItem } from '../../domain/entities/FridgeItem';

export class AIMealPlanGenerator {
  async generateMealPlan(
    fridgeItems: FridgeItem[],
    startDate: Date,
    endDate: Date,
    allergens: string[],
  ): Promise<MealPlan> {
    // TODO: Implement AI meal plan generation API call
    return {
      id: '',
      startDate,
      endDate,
      items: [],
      estimatedBudget: 0,
      allergens,
    };
  }
}
