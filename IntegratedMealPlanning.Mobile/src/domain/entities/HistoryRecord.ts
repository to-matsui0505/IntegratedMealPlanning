/**
 * 履歴記録エンティティ
 * 冷蔵庫アイテムの増減履歴を記録するドメインエンティティ
 */
export enum ChangeType {
  INCREASE = '増加',
  DECREASE = '減少',
}

export interface HistoryRecord {
  /** 履歴ID */
  id: string;
  /** 冷蔵庫アイテムID */
  fridgeItemId: string;
  /** 変更タイプ */
  changeType: ChangeType;
  /** 変更量 */
  changeAmount: number;
  /** 日付 */
  date: Date;
}
