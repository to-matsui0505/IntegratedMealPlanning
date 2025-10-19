import { FridgeItem, ItemType } from '@/src/domain/entities/FridgeItem';
import { FridgeRepository } from '@/src/domain/repositories/FridgeRepository';
import { HistoryRepository } from '@/src/domain/repositories/HistoryRepository';
import { ChangeType, HistoryRecord } from '@/src/domain/entities/HistoryRecord';

/**
 * アイテム追加ユースケース
 * 冷蔵庫にアイテムを追加する
 */
export class AddItemUseCase {
  constructor(
    private fridgeRepository: FridgeRepository,
    private historyRepository: HistoryRepository
  ) {}

  /**
   * アイテムを追加する
   * @param item 追加する冷蔵庫アイテム
   */
  async execute(item: FridgeItem): Promise<void> {
    // アイテムの検証
    if (!item.name || item.name.trim() === '') {
      throw new Error('アイテム名は必須です');
    }

    if (item.quantity <= 0) {
      throw new Error('数量は0より大きい値を指定してください');
    }

    // アイテムを保存
    await this.fridgeRepository.save(item);

    // 履歴記録を作成
    const historyRecord: HistoryRecord = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fridgeItemId: item.id,
      changeType: item.type === ItemType.INBOUND ? ChangeType.INCREASE : ChangeType.DECREASE,
      changeAmount: item.quantity,
      date: item.updatedAt,
      category: item.category,
      subCategory: item.subCategory,
      itemName: item.name,
      unit: item.unit,
    };
    await this.historyRepository.save(historyRecord);
  }

  /**
   * 複数のアイテムを一括追加する
   * @param items 追加する冷蔵庫アイテムのリスト
   */
  async executeBatch(items: FridgeItem[]): Promise<void> {
    // 各アイテムの検証
    for (const item of items) {
      if (!item.name || item.name.trim() === '') {
        throw new Error('アイテム名は必須です');
      }

      if (item.quantity <= 0) {
        throw new Error('数量は0より大きい値を指定してください');
      }
    }

    // アイテムを一括保存
    for (const item of items) {
      await this.fridgeRepository.save(item);
      
      // 履歴記録を作成
      const historyRecord: HistoryRecord = {
        id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        fridgeItemId: item.id,
        changeType: item.type === ItemType.INBOUND ? ChangeType.INCREASE : ChangeType.DECREASE,
        changeAmount: item.quantity,
        date: item.updatedAt,
        category: item.category,
        subCategory: item.subCategory,
        itemName: item.name,
        unit: item.unit,
      };
      await this.historyRepository.save(historyRecord);
    }
  }
}
