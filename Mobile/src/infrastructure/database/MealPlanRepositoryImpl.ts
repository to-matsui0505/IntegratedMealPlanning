import { MealPlan } from '../../domain/entities/MealPlan';
import { MealPlanRepository } from '../../domain/repositories/MealPlanRepository';

export class MealPlanRepositoryImpl implements MealPlanRepository {
  async save(_plan: MealPlan): Promise<void> {
    // TODO: Implement SQLite save logic
  }

  async findAll(): Promise<MealPlan[]> {
    // TODO: Implement SQLite findAll logic
    return [];
  }

  async findById(_id: string): Promise<MealPlan | null> {
    // TODO: Implement SQLite findById logic
    return null;
  }

  async delete(_id: string): Promise<void> {
    // TODO: Implement SQLite delete logic
  }
}
