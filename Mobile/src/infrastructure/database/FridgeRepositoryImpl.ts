import { FridgeItem, FridgeItemType } from '../../domain/entities/FridgeItem';
import { Summary } from '../../domain/entities/Summary';
import { FridgeRepository } from '../../domain/repositories/FridgeRepository';

export class FridgeRepositoryImpl implements FridgeRepository {
  // モックデータ
  private mockItems: FridgeItem[] = [
    {
      id: '1',
      type: FridgeItemType.IN,
      category: '野菜',
      subCategory: '葉物',
      name: 'キャベツ',
      quantity: 1,
      unit: '個',
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      type: FridgeItemType.IN,
      category: '肉',
      subCategory: '鶏肉',
      name: '鶏もも肉',
      quantity: 300,
      unit: 'g',
      updatedAt: new Date('2024-01-14'),
    },
    {
      id: '3',
      type: FridgeItemType.IN,
      category: '乳製品',
      subCategory: '牛乳',
      name: '牛乳',
      quantity: 1,
      unit: 'L',
      updatedAt: new Date('2024-01-13'),
    },
    {
      id: '4',
      type: FridgeItemType.IN,
      category: '調味料',
      subCategory: '液体調味料',
      name: '醤油',
      quantity: 500,
      unit: 'ml',
      updatedAt: new Date('2024-01-10'),
    },
    {
      id: '5',
      type: FridgeItemType.IN,
      category: '野菜',
      subCategory: '根菜',
      name: '人参',
      quantity: 3,
      unit: '本',
      updatedAt: new Date('2024-01-12'),
    },
  ];

  async save(_item: FridgeItem): Promise<void> {
    // TODO: Implement SQLite save logic
  }

  async findAll(): Promise<FridgeItem[]> {
    // モックデータを返す
    return this.mockItems;
  }

  async findById(_id: string): Promise<FridgeItem | null> {
    // TODO: Implement SQLite findById logic
    return null;
  }

  async delete(_id: string): Promise<void> {
    // TODO: Implement SQLite delete logic
  }

  async getSummary(): Promise<Summary[]> {
    // カテゴリ別に集計
    const summaryMap = new Map<string, { itemCount: number; totalQty: number }>();

    for (const item of this.mockItems) {
      const existing = summaryMap.get(item.category) || { itemCount: 0, totalQty: 0 };
      existing.itemCount += 1;
      existing.totalQty += item.quantity;
      summaryMap.set(item.category, existing);
    }

    return Array.from(summaryMap.entries()).map(([category, data]) => ({
      category,
      itemCount: data.itemCount,
      totalQty: data.totalQty,
    }));
  }
}
