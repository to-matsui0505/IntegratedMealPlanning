import { MealPlan } from '../entities/MealPlan';

export interface MealPlanRepository {
  save(plan: MealPlan): Promise<void>;
  findAll(): Promise<MealPlan[]>;
  findById(id: string): Promise<MealPlan | null>;
  delete(id: string): Promise<void>;
}
