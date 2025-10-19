/**
 * 冷蔵庫アイテムエンティティ
 * 冷蔵庫内の食材を表現するドメインエンティティ
 */
export enum ItemType {
  INBOUND = '入庫',
  OUTBOUND = '出庫',
}

export interface FridgeItem {
  /** アイテムID */
  id: string;
  /** 入出庫タイプ */
  type: ItemType;
  /** 大分類（肉類、野菜類、乳製品、飲料、調味料、酒類など） */
  category: string;
  /** 小分類（ハム、ベーコン、牛肉、豚肉、鶏肉など） */
  subCategory: string;
  /** 名称（部位、一般名称。加工食品は製品名も可） */
  name: string;
  /** 数量 */
  quantity: number;
  /** 単位 */
  unit: string;
  /** 更新日（入出庫日） */
  updatedAt: Date;
}
