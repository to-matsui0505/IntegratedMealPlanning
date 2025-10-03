import { FridgeItem } from '../../domain/entities/FridgeItem';
import { FridgeRepository } from '../../domain/repositories/FridgeRepository';
import { TransactionType } from '../../domain/valueobjects/TransactionType';

/**
 * アイテム追加ユースケース
 */
export class AddItemUseCase {
  constructor(private readonly fridgeRepository: FridgeRepository) {}

  async execute(
    category: string,
    subCategory: string,
    name: string,
    quantity: number,
    unit: string,
  ): Promise<void> {
    const item = new FridgeItem(
      this.generateId(),
      TransactionType.IN,
      category,
      subCategory,
      name,
      quantity,
      unit,
      new Date(),
    );

    await this.fridgeRepository.save(item);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
