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
}
