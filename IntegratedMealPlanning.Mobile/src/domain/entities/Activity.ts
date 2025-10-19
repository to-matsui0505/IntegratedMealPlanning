/**
 * アクティビティエンティティ
 * 冷蔵庫や献立に関する操作履歴を記録するドメインエンティティ
 */
export enum ActivityType {
  ADD = 'add',
  USE = 'use',
  DISCARD = 'discard',
  EDIT = 'edit',
  MEAL_PLAN = 'meal_plan',
}

export interface Activity {
  /** アクティビティID */
  id: string;
  /** アクティビティタイプ */
  type: ActivityType;
  /** アイテムID（オプション） */
  itemId?: string;
  /** アイテム名 */
  itemName: string;
  /** 数量（オプション） */
  qty?: number;
  /** ユーザーID */
  userId: string;
  /** タイムスタンプ */
  timestamp: Date;
  /** メタデータ（追加情報） */
  meta?: Record<string, any>;
}
