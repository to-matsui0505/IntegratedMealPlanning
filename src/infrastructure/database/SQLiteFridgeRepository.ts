import { FridgeItem } from '../../domain/entities/FridgeItem';
import { FridgeRepository } from '../../domain/repositories/FridgeRepository';
import { TransactionType } from '../../domain/valueobjects/TransactionType';

/**
 * SQLite実装の冷蔵庫リポジトリ
 */
export class SQLiteFridgeRepository implements FridgeRepository {
  async save(item: FridgeItem): Promise<void> {
    // TODO: SQLiteへの保存処理を実装
    console.log('Saving item to SQLite:', item);
  }

  async findAll(): Promise<FridgeItem[]> {
    // TODO: SQLiteからの取得処理を実装
    console.log('Finding all items from SQLite');
    return [];
  }

  async findById(id: string): Promise<FridgeItem | null> {
    // TODO: SQLiteからの取得処理を実装
    console.log('Finding item by id from SQLite:', id);
    return null;
  }

  async delete(id: string): Promise<void> {
    // TODO: SQLiteからの削除処理を実装
    console.log('Deleting item from SQLite:', id);
  }
}
