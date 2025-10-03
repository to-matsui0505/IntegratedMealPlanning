export enum FridgeItemType {
  IN = '入庫',
  OUT = '出庫',
}

export interface FridgeItem {
  id: string;
  type: FridgeItemType;
  category: string;
  subCategory: string;
  name: string;
  quantity: number;
  unit: string;
  updatedAt: Date;
}
