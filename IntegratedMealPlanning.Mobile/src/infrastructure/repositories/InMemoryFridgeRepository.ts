import { FridgeItem } from '@/src/domain/entities/FridgeItem';
import { FridgeRepository } from '@/src/domain/repositories/FridgeRepository';

/**
 * 冷蔵庫リポジトリのインメモリ実装
 * 実際のアプリではSQLiteを使用する予定
 */
export class InMemoryFridgeRepository implements FridgeRepository {
  private items: Map<string, FridgeItem> = new Map();

  async save(item: FridgeItem): Promise<void> {
    this.items.set(item.id, item);
  }

  async findAll(): Promise<FridgeItem[]> {
    return Array.from(this.items.values());
  }

  async findById(id: string): Promise<FridgeItem | null> {
    return this.items.get(id) || null;
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }
}
