import { MealPlanItem } from './MealPlanItem';

/**
 * 献立計画エンティティ
 * ユーザーの献立計画を表現するドメインエンティティ
 */
export interface MealPlan {
  /** 献立計画ID */
  id: string;
  /** 開始日 */
  startDate: Date;
  /** 終了日 */
  endDate: Date;
  /** 献立アイテムリスト */
  items: MealPlanItem[];
  /** 推定予算 */
  estimatedBudget: number;
  /** アレルゲンリスト */
  allergens: string[];
}
