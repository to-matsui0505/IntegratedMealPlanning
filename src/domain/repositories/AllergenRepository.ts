import { Allergen } from '../entities/Allergen';

/**
 * アレルゲンリポジトリインターフェース
 */
export interface AllergenRepository {
  save(allergen: Allergen): Promise<void>;
  findAll(): Promise<Allergen[]>;
  findEnabled(): Promise<Allergen[]>;
  delete(id: string): Promise<void>;
}
