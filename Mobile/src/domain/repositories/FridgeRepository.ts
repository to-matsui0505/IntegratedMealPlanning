import { FridgeItem } from '../entities/FridgeItem';

export interface FridgeRepository {
  save(item: FridgeItem): Promise<void>;
  findAll(): Promise<FridgeItem[]>;
  findById(id: string): Promise<FridgeItem | null>;
  delete(id: string): Promise<void>;
}
