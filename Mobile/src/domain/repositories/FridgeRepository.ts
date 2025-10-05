import { FridgeItem } from '../entities/FridgeItem';
import { Summary } from '../entities/Summary';

export interface FridgeRepository {
  save(item: FridgeItem): Promise<void>;
  findAll(): Promise<FridgeItem[]>;
  findById(id: string): Promise<FridgeItem | null>;
  delete(id: string): Promise<void>;
  getSummary(): Promise<Summary[]>;
}
