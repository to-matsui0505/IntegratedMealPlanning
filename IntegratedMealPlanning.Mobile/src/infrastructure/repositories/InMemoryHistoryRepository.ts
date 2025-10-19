import { ChangeType, HistoryRecord } from '@/src/domain/entities/HistoryRecord';
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
    return Array.from(this.records.values()).sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }

  async findById(id: string): Promise<HistoryRecord | null> {
    return this.records.get(id) || null;
  }

  async findByFridgeItemId(fridgeItemId: string): Promise<HistoryRecord[]> {
    return Array.from(this.records.values())
      .filter((record) => record.fridgeItemId === fridgeItemId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async findByMonth(
    year: number,
    month: number,
    changeType?: ChangeType
  ): Promise<HistoryRecord[]> {
    return Array.from(this.records.values())
      .filter((record) => {
        const recordDate = record.date;
        const matchesDate =
          recordDate.getFullYear() === year &&
          recordDate.getMonth() + 1 === month;
        const matchesType = !changeType || record.changeType === changeType;
        return matchesDate && matchesType;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async findByCategory(
    year: number,
    month: number,
    category: string,
    subCategory?: string,
    changeType?: ChangeType
  ): Promise<HistoryRecord[]> {
    return Array.from(this.records.values())
      .filter((record) => {
        const recordDate = record.date;
        const matchesDate =
          recordDate.getFullYear() === year &&
          recordDate.getMonth() + 1 === month;
        const matchesCategory = record.category === category;
        const matchesSubCategory =
          !subCategory || record.subCategory === subCategory;
        const matchesType = !changeType || record.changeType === changeType;
        return matchesDate && matchesCategory && matchesSubCategory && matchesType;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  async update(id: string, updates: Partial<HistoryRecord>): Promise<void> {
    const record = this.records.get(id);
    if (!record) {
      throw new Error(`履歴記録が見つかりません: ${id}`);
    }
    this.records.set(id, { ...record, ...updates });
  }

  async delete(id: string): Promise<void> {
    if (!this.records.has(id)) {
      throw new Error(`履歴記録が見つかりません: ${id}`);
    }
    this.records.delete(id);
  }
}
