import { MealPlan } from '@/src/domain/entities/MealPlan';
import { MealPlanRepository } from '@/src/domain/repositories/MealPlanRepository';

/**
 * 献立計画リポジトリのインメモリ実装
 * 実際のアプリではSQLiteを使用する予定
 */
export class InMemoryMealPlanRepository implements MealPlanRepository {
  private plans: Map<string, MealPlan> = new Map();

  async save(plan: MealPlan): Promise<void> {
    this.plans.set(plan.id, plan);
  }

  async findAll(): Promise<MealPlan[]> {
    return Array.from(this.plans.values());
  }

  async findById(id: string): Promise<MealPlan | null> {
    return this.plans.get(id) || null;
  }

  async delete(id: string): Promise<void> {
    this.plans.delete(id);
  }
}
