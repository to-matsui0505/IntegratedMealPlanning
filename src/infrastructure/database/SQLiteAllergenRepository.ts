import { Allergen } from '../../domain/entities/Allergen';
import { AllergenRepository } from '../../domain/repositories/AllergenRepository';

/**
 * SQLite実装のアレルゲンリポジトリ
 */
export class SQLiteAllergenRepository implements AllergenRepository {
  async save(allergen: Allergen): Promise<void> {
    // TODO: SQLiteへの保存処理を実装
    console.log('Saving allergen to SQLite:', allergen);
  }

  async findAll(): Promise<Allergen[]> {
    // TODO: SQLiteからの取得処理を実装
    console.log('Finding all allergens from SQLite');
    return [];
  }

  async findEnabled(): Promise<Allergen[]> {
    // TODO: SQLiteからの有効なアレルゲン取得処理を実装
    console.log('Finding enabled allergens from SQLite');
    return [];
  }

  async delete(id: string): Promise<void> {
    // TODO: SQLiteからの削除処理を実装
    console.log('Deleting allergen from SQLite:', id);
  }
}
