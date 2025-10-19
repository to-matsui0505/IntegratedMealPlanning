import { FridgeItem, ItemType } from '@/src/domain/entities/FridgeItem';
import { FridgeRepository } from '@/src/domain/repositories/FridgeRepository';

/**
 * 冷蔵庫リポジトリのインメモリ実装
 * 実際のアプリではSQLiteを使用する予定
 */
export class InMemoryFridgeRepository implements FridgeRepository {
  private items: Map<string, FridgeItem> = new Map();

  constructor() {
    // デモ用のサンプルデータを初期化
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleItems: FridgeItem[] = [
      {
        id: '1',
        type: ItemType.INBOUND,
        category: '野菜類',
        subCategory: '葉物野菜',
        name: 'キャベツ',
        quantity: 1,
        unit: '個',
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: '2',
        type: ItemType.INBOUND,
        category: '野菜類',
        subCategory: '根菜',
        name: 'にんじん',
        quantity: 3,
        unit: '本',
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: '3',
        type: ItemType.INBOUND,
        category: '肉類',
        subCategory: '豚肉',
        name: '豚バラ肉',
        quantity: 300,
        unit: 'g',
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: '4',
        type: ItemType.INBOUND,
        category: '肉類',
        subCategory: '鶏肉',
        name: '鶏もも肉',
        quantity: 400,
        unit: 'g',
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: '5',
        type: ItemType.INBOUND,
        category: '乳製品',
        subCategory: '牛乳',
        name: '牛乳',
        quantity: 1,
        unit: 'L',
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: '6',
        type: ItemType.INBOUND,
        category: '乳製品',
        subCategory: 'チーズ',
        name: 'スライスチーズ',
        quantity: 8,
        unit: '枚',
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: '7',
        type: ItemType.INBOUND,
        category: '調味料',
        subCategory: '醤油',
        name: '醤油',
        quantity: 1,
        unit: '本',
        updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: '8',
        type: ItemType.INBOUND,
        category: '野菜類',
        subCategory: '茎菜',
        name: 'ネギ',
        quantity: 2,
        unit: '本',
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    sampleItems.forEach((item) => {
      this.items.set(item.id, item);
    });
  }

  async save(item: FridgeItem): Promise<void> {
    this.items.set(item.id, item);
  }

  async findAll(): Promise<FridgeItem[]> {
    return Array.from(this.items.values());
  }

  async findById(id: string): Promise<FridgeItem | null> {
    return this.items.get(id) || null;
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }
}
