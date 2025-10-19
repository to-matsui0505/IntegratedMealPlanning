import { HistoryRecord } from '../entities/HistoryRecord';

/**
 * 履歴リポジトリインターフェース
 * 履歴記録の永続化を抽象化するインターフェース
 */
export interface HistoryRepository {
  /**
   * 履歴記録を保存する
   * @param record 保存する履歴記録
   */
  save(record: HistoryRecord): Promise<void>;

  /**
   * すべての履歴記録を取得する
   * @returns 全履歴記録のリスト
   */
  findAll(): Promise<HistoryRecord[]>;

  /**
   * IDで履歴記録を検索する
   * @param id 履歴記録ID
   * @returns 見つかった履歴記録またはnull
   */
  findById(id: string): Promise<HistoryRecord | null>;

  /**
   * 冷蔵庫アイテムIDで履歴記録を検索する
   * @param fridgeItemId 冷蔵庫アイテムID
   * @returns 該当する履歴記録のリスト
   */
  findByFridgeItemId(fridgeItemId: string): Promise<HistoryRecord[]>;
}
