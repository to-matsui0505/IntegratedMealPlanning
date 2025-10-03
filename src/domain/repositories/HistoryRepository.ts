import { HistoryRecord } from '../entities/HistoryRecord';

/**
 * 履歴リポジトリインターフェース
 */
export interface HistoryRepository {
  save(record: HistoryRecord): Promise<void>;
  findAll(): Promise<HistoryRecord[]>;
  findByFridgeItemId(fridgeItemId: string): Promise<HistoryRecord[]>;
}
