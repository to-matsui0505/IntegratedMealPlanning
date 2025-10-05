export enum FridgeItemType {
  IN = '入庫',
  OUT = '出庫',
}

export enum FridgeItemSource {
  CAMERA = 'CAMERA',
  RECEIPT = 'RECEIPT',
  MANUAL = 'MANUAL',
}

export interface FridgeItem {
  id: string;
  type: FridgeItemType;
  category: string;
  subCategory: string;
  name: string;
  quantity: number;
  unit: string;
  source?: FridgeItemSource;
  sourceImageId?: string;
  updatedAt: Date;
}
