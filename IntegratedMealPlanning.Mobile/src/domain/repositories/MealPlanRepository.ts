import { MealPlan } from '../entities/MealPlan';

/**
 * 献立計画リポジトリインターフェース
 * 献立計画の永続化を抽象化するインターフェース
 */
export interface MealPlanRepository {
  /**
   * 献立計画を保存する
   * @param plan 保存する献立計画
   */
  save(plan: MealPlan): Promise<void>;

  /**
   * すべての献立計画を取得する
   * @returns 全献立計画のリスト
   */
  findAll(): Promise<MealPlan[]>;

  /**
   * IDで献立計画を検索する
   * @param id 献立計画ID
   * @returns 見つかった献立計画またはnull
   */
  findById(id: string): Promise<MealPlan | null>;

  /**
   * 献立計画を削除する
   * @param id 削除する献立計画のID
   */
  delete(id: string): Promise<void>;
}
