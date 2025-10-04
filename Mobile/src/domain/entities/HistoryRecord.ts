export enum ChangeType {
  INCREASE = '増加',
  DECREASE = '減少',
}

export interface HistoryRecord {
  id: string;
  fridgeItemId: string;
  changeType: ChangeType;
  changeAmount: number;
  date: Date;
}
