import { ChangeType } from '../valueobjects/ChangeType';

/**
 * 履歴レコードエンティティ
 */
export class HistoryRecord {
  constructor(
    public readonly id: string,
    public readonly fridgeItemId: string,
    public readonly changeType: ChangeType,
    public readonly changeAmount: number,
    public readonly date: Date,
  ) {}
}
