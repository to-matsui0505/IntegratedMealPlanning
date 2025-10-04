import { FridgeItem } from '../../domain/entities/FridgeItem';
import { FridgeRepository } from '../../domain/repositories/FridgeRepository';

export class FridgeRepositoryImpl implements FridgeRepository {
  async save(_item: FridgeItem): Promise<void> {
    // TODO: Implement SQLite save logic
  }

  async findAll(): Promise<FridgeItem[]> {
    // TODO: Implement SQLite findAll logic
    return [];
  }

  async findById(_id: string): Promise<FridgeItem | null> {
    // TODO: Implement SQLite findById logic
    return null;
  }

  async delete(_id: string): Promise<void> {
    // TODO: Implement SQLite delete logic
  }
}
