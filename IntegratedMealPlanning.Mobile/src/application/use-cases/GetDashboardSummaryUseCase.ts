import { FridgeRepository } from '@/src/domain/repositories/FridgeRepository';
import { Summary } from '@/src/domain/entities/Summary';

/**
 * ダッシュボードサマリー取得ユースケース
 * カテゴリ別の在庫サマリーを取得する
 */
export class GetDashboardSummaryUseCase {
  constructor(private fridgeRepository: FridgeRepository) {}

  /**
   * カテゴリ別のサマリーを計算して取得する
   * @returns サマリーのリスト
   */
  async execute(): Promise<Summary[]> {
    const items = await this.fridgeRepository.findAll();
    
    // カテゴリごとに集計
    const categoryMap = new Map<string, { itemCount: number; totalQty: number }>();
    
    for (const item of items) {
      const existing = categoryMap.get(item.category) || { itemCount: 0, totalQty: 0 };
      categoryMap.set(item.category, {
        itemCount: existing.itemCount + 1,
        totalQty: existing.totalQty + item.quantity,
      });
    }
    
    // Summaryオブジェクトの配列に変換
    return Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      itemCount: data.itemCount,
      totalQty: data.totalQty,
    }));
  }
}
