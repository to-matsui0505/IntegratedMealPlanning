/**
 * 献立アイテムエンティティ
 * 献立計画の個別アイテム（1食分）を表現するドメインエンティティ
 */
export enum MealType {
  BREAKFAST = '朝食',
  LUNCH = '昼食',
  DINNER = '夕食',
}

export interface MealPlanItem {
  /** 献立アイテムID */
  id: string;
  /** 献立計画ID */
  mealPlanId: string;
  /** 日付 */
  date: Date;
  /** 食事タイプ */
  mealType: MealType;
  /** 料理名 */
  dishName: string;
  /** 材料リスト */
  ingredients: string[];
  /** レシピテキスト */
  recipeText: string;
  /** 推定カロリー */
  estimatedCalories: number;
  /** 推定コスト */
  estimatedCost: number;
  /** 外部レシピURL */
  externalRecipeUrl?: string;
}
