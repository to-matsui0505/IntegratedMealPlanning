import { HistoryRecord } from '@/src/domain/entities/HistoryRecord';
import { HistoryRepository } from '@/src/domain/repositories/HistoryRepository';

/**
 * 履歴取得ユースケース
 * 冷蔵庫の履歴を取得する
 */
export class GetHistoryUseCase {
  constructor(private historyRepository: HistoryRepository) {}

  /**
   * すべての履歴記録を取得する
   * @returns 履歴記録のリスト
   */
  async execute(): Promise<HistoryRecord[]> {
    return await this.historyRepository.findAll();
  }

  /**
   * 特定の冷蔵庫アイテムの履歴を取得する
   * @param fridgeItemId 冷蔵庫アイテムID
   * @returns 該当する履歴記録のリスト
   */
  async executeByItemId(fridgeItemId: string): Promise<HistoryRecord[]> {
    return await this.historyRepository.findByFridgeItemId(fridgeItemId);
  }
}
