import { FridgeItem } from '../../domain/entities/FridgeItem';
import { FridgeRepository } from '../../domain/repositories/FridgeRepository';

/**
 * 現在のアイテム取得ユースケース
 */
export class GetCurrentItemsUseCase {
  constructor(private readonly fridgeRepository: FridgeRepository) {}

  async execute(): Promise<FridgeItem[]> {
    return await this.fridgeRepository.findAll();
  }
}
