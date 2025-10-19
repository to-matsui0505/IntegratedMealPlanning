import { diContainer } from '../src/infrastructure/di/DIContainer';
import { ItemType } from '../src/domain/entities/FridgeItem';

/**
 * テスト用のサンプル履歴データを作成するスクリプト
 */
async function createSampleHistoryData() {
  console.log('Creating sample history data...');
  
  const addItemUseCase = diContainer.getAddItemUseCase();
  
  // 現在の月のデータ
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  // サンプルデータ: 野菜類
  const vegetableItems = [
    {
      id: `item-${Date.now()}-1`,
      type: ItemType.INBOUND,
      category: '野菜類',
      subCategory: 'キャベツ',
      name: 'キャベツ',
      quantity: 1,
      unit: '個',
      updatedAt: new Date(currentYear, currentMonth, 1),
    },
    {
      id: `item-${Date.now()}-2`,
      type: ItemType.OUTBOUND,
      category: '野菜類',
      subCategory: 'キャベツ',
      name: 'キャベツ（千切り）',
      quantity: 0.5,
      unit: '個',
      updatedAt: new Date(currentYear, currentMonth, 5),
    },
    {
      id: `item-${Date.now()}-3`,
      type: ItemType.INBOUND,
      category: '野菜類',
      subCategory: '人参',
      name: '人参',
      quantity: 300,
      unit: 'g',
      updatedAt: new Date(currentYear, currentMonth, 3),
    },
    {
      id: `item-${Date.now()}-4`,
      type: ItemType.OUTBOUND,
      category: '野菜類',
      subCategory: '人参',
      name: '人参（サラダ用）',
      quantity: 100,
      unit: 'g',
      updatedAt: new Date(currentYear, currentMonth, 8),
    },
    {
      id: `item-${Date.now()}-5`,
      type: ItemType.INBOUND,
      category: '野菜類',
      subCategory: '玉ねぎ',
      name: '玉ねぎ',
      quantity: 3,
      unit: '個',
      updatedAt: new Date(currentYear, currentMonth, 2),
    },
  ];
  
  // サンプルデータ: 肉類
  const meatItems = [
    {
      id: `item-${Date.now()}-6`,
      type: ItemType.INBOUND,
      category: '肉類',
      subCategory: '牛肉',
      name: '牛ステーキ肉',
      quantity: 200,
      unit: 'g',
      updatedAt: new Date(currentYear, currentMonth, 10),
    },
    {
      id: `item-${Date.now()}-7`,
      type: ItemType.OUTBOUND,
      category: '肉類',
      subCategory: '牛肉',
      name: '牛ステーキ肉',
      quantity: 200,
      unit: 'g',
      updatedAt: new Date(currentYear, currentMonth, 15),
    },
    {
      id: `item-${Date.now()}-8`,
      type: ItemType.INBOUND,
      category: '肉類',
      subCategory: '豚肉',
      name: '豚バラ肉',
      quantity: 400,
      unit: 'g',
      updatedAt: new Date(currentYear, currentMonth, 7),
    },
    {
      id: `item-${Date.now()}-9`,
      type: ItemType.OUTBOUND,
      category: '肉類',
      subCategory: '豚肉',
      name: '豚バラ肉（生姜焼き用）',
      quantity: 150,
      unit: 'g',
      updatedAt: new Date(currentYear, currentMonth, 12),
    },
    {
      id: `item-${Date.now()}-10`,
      type: ItemType.INBOUND,
      category: '肉類',
      subCategory: '鶏肉',
      name: '鶏もも肉',
      quantity: 300,
      unit: 'g',
      updatedAt: new Date(currentYear, currentMonth, 9),
    },
  ];
  
  // サンプルデータ: 乳製品
  const dairyItems = [
    {
      id: `item-${Date.now()}-11`,
      type: ItemType.INBOUND,
      category: '乳製品',
      subCategory: '牛乳',
      name: '牛乳',
      quantity: 1,
      unit: 'L',
      updatedAt: new Date(currentYear, currentMonth, 4),
    },
    {
      id: `item-${Date.now()}-12`,
      type: ItemType.OUTBOUND,
      category: '乳製品',
      subCategory: '牛乳',
      name: '牛乳',
      quantity: 0.5,
      unit: 'L',
      updatedAt: new Date(currentYear, currentMonth, 11),
    },
    {
      id: `item-${Date.now()}-13`,
      type: ItemType.INBOUND,
      category: '乳製品',
      subCategory: 'チーズ',
      name: 'スライスチーズ',
      quantity: 1,
      unit: 'パック',
      updatedAt: new Date(currentYear, currentMonth, 6),
    },
  ];
  
  // すべてのアイテムを追加
  const allItems = [...vegetableItems, ...meatItems, ...dairyItems];
  
  for (const item of allItems) {
    try {
      await addItemUseCase.execute(item);
      console.log(`Added item: ${item.name}`);
    } catch (error) {
      console.error(`Error adding item ${item.name}:`, error);
    }
  }
  
  console.log('Sample history data created successfully!');
  console.log(`Total items added: ${allItems.length}`);
}

// スクリプトとして実行された場合
if (require.main === module) {
  createSampleHistoryData()
    .then(() => {
      console.log('Done!');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

export { createSampleHistoryData };
