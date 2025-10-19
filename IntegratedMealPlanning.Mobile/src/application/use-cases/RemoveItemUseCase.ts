import { FridgeRepository } from '@/src/domain/repositories/FridgeRepository';

/**
 * アイテム削除ユースケース
 * 冷蔵庫からアイテムを削除する
 */
export class RemoveItemUseCase {
  constructor(private fridgeRepository: FridgeRepository) {}

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

    // アイテムを削除
    await this.fridgeRepository.delete(id);
  }
}
