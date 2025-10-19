import { HistoryRecord } from '@/src/domain/entities/HistoryRecord';
import { HistoryRepository } from '@/src/domain/repositories/HistoryRepository';

/**
 * 履歴リポジトリのインメモリ実装
 * 実際のアプリではSQLiteを使用する予定
 */
export class InMemoryHistoryRepository implements HistoryRepository {
  private records: Map<string, HistoryRecord> = new Map();

  async save(record: HistoryRecord): Promise<void> {
    this.records.set(record.id, record);
  }

  async findAll(): Promise<HistoryRecord[]> {
    return Array.from(this.records.values());
  }

  async findById(id: string): Promise<HistoryRecord | null> {
    return this.records.get(id) || null;
  }

  async findByFridgeItemId(fridgeItemId: string): Promise<HistoryRecord[]> {
    return Array.from(this.records.values()).filter(
      (record) => record.fridgeItemId === fridgeItemId
    );
  }
}
