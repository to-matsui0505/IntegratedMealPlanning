import { MealPlan } from '../../domain/entities/MealPlan';
import { FridgeItem } from '../../domain/entities/FridgeItem';
import { Allergen } from '../../domain/entities/Allergen';

/**
 * 献立生成リクエスト
 */
export interface MealPlanGenerationRequest {
  startDate: Date;
  endDate: Date;
  fridgeItems: FridgeItem[];
  allergens: Allergen[];
  maxBudget?: number;
}

/**
 * AI献立生成サービス
 */
export class AIMealPlanGenerator {
  async generate(request: MealPlanGenerationRequest): Promise<MealPlan[]> {
    // TODO: AI献立生成APIとの連携を実装
    console.log('Generating meal plans with AI:', request);
    
    // AIは以下を考慮する:
    // 1. 冷蔵庫の中身を優先的に使用
    // 2. 足りない食材は購入前提で献立作成
    // 3. アレルゲンを避ける
    // 4. 予算内に収める（設定されている場合）
    // 5. カロリー情報を計算
    // 6. 詳細な調理手順を提供
    // 7. 料理サイトへのリンク（オプション）
    
    // 仮の実装: 空の配列を返す
    return [];
  }
}
