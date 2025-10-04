import { FridgeItem } from '../domain/entities/FridgeItem';
import { FridgeRepository } from '../domain/repositories/FridgeRepository';

export class AddItemUseCase {
  constructor(private fridgeRepository: FridgeRepository) {}

  async execute(item: FridgeItem): Promise<void> {
    await this.fridgeRepository.save(item);
  }
}
