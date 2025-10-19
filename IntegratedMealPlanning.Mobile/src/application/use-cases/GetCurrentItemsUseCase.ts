import { FridgeItem } from '@/src/domain/entities/FridgeItem';
import { FridgeRepository } from '@/src/domain/repositories/FridgeRepository';

/**
 * 現在のアイテム取得ユースケース
 * 冷蔵庫の現在の中身を取得する
 */
export class GetCurrentItemsUseCase {
  constructor(private fridgeRepository: FridgeRepository) {}

  /**
   * すべての冷蔵庫アイテムを取得する
   * @returns 冷蔵庫アイテムのリスト
   */
  async execute(): Promise<FridgeItem[]> {
    return await this.fridgeRepository.findAll();
  }
}
