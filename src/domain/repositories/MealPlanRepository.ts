import { MealPlan } from '../entities/MealPlan';

/**
 * 献立リポジトリインターフェース
 */
export interface MealPlanRepository {
  save(plan: MealPlan): Promise<void>;
  findAll(): Promise<MealPlan[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<MealPlan[]>;
  findById(id: string): Promise<MealPlan | null>;
  delete(id: string): Promise<void>;
}
