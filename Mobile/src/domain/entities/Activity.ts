export enum ActivityType {
  ADD = 'add',
  USE = 'use',
  DISCARD = 'discard',
  EDIT = 'edit',
  MEAL_PLAN = 'meal_plan',
}

export interface Activity {
  id: string;
  type: ActivityType;
  itemId?: string;
  itemName: string;
  qty?: number;
  userId: string;
  timestamp: Date;
  meta?: Record<string, unknown>;
}
