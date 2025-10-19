import { ChangeType, HistoryRecord } from '../entities/HistoryRecord';

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

  /**
   * 月次で履歴記録を取得する
   * @param year 年
   * @param month 月 (1-12)
   * @param changeType 変更タイプ（オプション）
   * @returns 該当する履歴記録のリスト
   */
  findByMonth(
    year: number,
    month: number,
    changeType?: ChangeType
  ): Promise<HistoryRecord[]>;

  /**
   * カテゴリで履歴記録を取得する
   * @param year 年
   * @param month 月 (1-12)
   * @param category 大分類
   * @param subCategory 小分類（オプション）
   * @param changeType 変更タイプ（オプション）
   * @returns 該当する履歴記録のリスト
   */
  findByCategory(
    year: number,
    month: number,
    category: string,
    subCategory?: string,
    changeType?: ChangeType
  ): Promise<HistoryRecord[]>;

  /**
   * 履歴記録を更新する
   * @param id 履歴記録ID
   * @param record 更新する履歴記録
   */
  update(id: string, record: Partial<HistoryRecord>): Promise<void>;

  /**
   * 履歴記録を削除する
   * @param id 履歴記録ID
   */
  delete(id: string): Promise<void>;
}
