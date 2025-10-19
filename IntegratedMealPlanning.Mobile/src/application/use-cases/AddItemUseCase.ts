import { FridgeItem } from '@/src/domain/entities/FridgeItem';
import { FridgeRepository } from '@/src/domain/repositories/FridgeRepository';

/**
 * アイテム追加ユースケース
 * 冷蔵庫にアイテムを追加する
 */
export class AddItemUseCase {
  constructor(private fridgeRepository: FridgeRepository) {}

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
    }
  }
}
