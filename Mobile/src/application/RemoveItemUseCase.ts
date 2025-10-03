import { FridgeRepository } from '../domain/repositories/FridgeRepository';

export class RemoveItemUseCase {
  constructor(private fridgeRepository: FridgeRepository) {}

  async execute(id: string): Promise<void> {
    await this.fridgeRepository.delete(id);
  }
}
