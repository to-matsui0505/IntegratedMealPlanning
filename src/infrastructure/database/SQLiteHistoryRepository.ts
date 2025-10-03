import { HistoryRecord } from '../../domain/entities/HistoryRecord';
import { HistoryRepository } from '../../domain/repositories/HistoryRepository';

/**
 * SQLite実装の履歴リポジトリ
 */
export class SQLiteHistoryRepository implements HistoryRepository {
  async save(record: HistoryRecord): Promise<void> {
    // TODO: SQLiteへの保存処理を実装
    console.log('Saving history record to SQLite:', record);
  }

  async findAll(): Promise<HistoryRecord[]> {
    // TODO: SQLiteからの取得処理を実装
    console.log('Finding all history records from SQLite');
    return [];
  }

  async findByFridgeItemId(fridgeItemId: string): Promise<HistoryRecord[]> {
    // TODO: SQLiteからの取得処理を実装
    console.log('Finding history records by fridge item id from SQLite:', fridgeItemId);
    return [];
  }
}
