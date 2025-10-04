import { MealPlanItem } from './MealPlanItem';

export interface MealPlan {
  id: string;
  startDate: Date;
  endDate: Date;
  items: MealPlanItem[];
  estimatedBudget: number;
  allergens: string[];
}
