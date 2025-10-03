import { FridgeRepository } from '../../domain/repositories/FridgeRepository';

/**
 * アイテム削除ユースケース
 */
export class RemoveItemUseCase {
  constructor(private readonly fridgeRepository: FridgeRepository) {}

  async execute(id: string): Promise<void> {
    await this.fridgeRepository.delete(id);
  }
}
