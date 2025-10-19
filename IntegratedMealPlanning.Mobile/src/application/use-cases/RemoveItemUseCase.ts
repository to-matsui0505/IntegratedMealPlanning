import { FridgeRepository } from '@/src/domain/repositories/FridgeRepository';
import { HistoryRepository } from '@/src/domain/repositories/HistoryRepository';
import { ChangeType, HistoryRecord } from '@/src/domain/entities/HistoryRecord';

/**
 * アイテム削除ユースケース
 * 冷蔵庫からアイテムを削除する
 */
export class RemoveItemUseCase {
  constructor(
    private fridgeRepository: FridgeRepository,
    private historyRepository: HistoryRepository
  ) {}

  /**
   * アイテムを削除する
   * @param id 削除するアイテムのID
   */
  async execute(id: string): Promise<void> {
    // アイテムの存在確認
    const item = await this.fridgeRepository.findById(id);
    if (!item) {
      throw new Error('指定されたアイテムが見つかりません');
    }

    // 削除前に履歴記録を作成（出庫として記録）
    const historyRecord: HistoryRecord = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fridgeItemId: item.id,
      changeType: ChangeType.DECREASE,
      changeAmount: item.quantity,
      date: new Date(),
      category: item.category,
      subCategory: item.subCategory,
      itemName: item.name,
      unit: item.unit,
    };
    await this.historyRepository.save(historyRecord);

    // アイテムを削除
    await this.fridgeRepository.delete(id);
  }
}
