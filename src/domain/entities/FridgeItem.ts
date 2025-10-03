import { TransactionType } from '../valueobjects/TransactionType';

/**
 * 冷蔵庫アイテムエンティティ
 */
export class FridgeItem {
  constructor(
    public readonly id: string,
    public readonly type: TransactionType,
    public readonly category: string,
    public readonly subCategory: string,
    public readonly name: string,
    public readonly quantity: number,
    public readonly unit: string,
    public readonly updatedAt: Date,
  ) {}
}
