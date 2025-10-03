import { FridgeItem } from '../entities/FridgeItem';

/**
 * 冷蔵庫リポジトリインターフェース
 */
export interface FridgeRepository {
  save(item: FridgeItem): Promise<void>;
  findAll(): Promise<FridgeItem[]>;
  findById(id: string): Promise<FridgeItem | null>;
  delete(id: string): Promise<void>;
}
