import { MealType } from '../valueobjects/MealType';
import { Ingredient } from '../valueobjects/Ingredient';

/**
 * 献立エンティティ
 */
export class MealPlan {
  constructor(
    public readonly id: string,
    public readonly date: Date,
    public readonly mealType: MealType,
    public readonly dishName: string,
    public readonly ingredients: Ingredient[],
    public readonly cookingSteps: string[],
    public readonly estimatedBudget: number,
    public readonly estimatedCalories: number,
    public readonly recipeUrl: string | null,
    public readonly allergens: string[],
  ) {}
}
