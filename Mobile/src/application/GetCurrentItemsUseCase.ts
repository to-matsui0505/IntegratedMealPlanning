import { FridgeItem } from '../domain/entities/FridgeItem';
import { FridgeRepository } from '../domain/repositories/FridgeRepository';

export class GetCurrentItemsUseCase {
  constructor(private fridgeRepository: FridgeRepository) {}

  async execute(): Promise<FridgeItem[]> {
    return await this.fridgeRepository.findAll();
  }
}
