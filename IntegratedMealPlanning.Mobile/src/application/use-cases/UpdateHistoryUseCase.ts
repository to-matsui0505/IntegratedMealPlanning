import { HistoryRepository } from '@/src/domain/repositories/HistoryRepository';
import { ChangeType } from '@/src/domain/entities/HistoryRecord';

/**
 * 履歴更新ユースケース
 * 履歴記録の編集・削除を行う
 */
export class UpdateHistoryUseCase {
  constructor(private historyRepository: HistoryRepository) {}

  /**
   * 履歴記録を更新する
   * @param historyId 履歴記録ID
   * @param updateData 更新するデータ
   */
  async updateHistory(
    historyId: string,
    updateData: {
      date?: Date;
      itemName?: string;
      changeType?: ChangeType;
      changeAmount?: number;
      unit?: string;
    }
  ): Promise<void> {
    // バリデーション
    if (updateData.changeAmount !== undefined && updateData.changeAmount <= 0) {
      throw new Error('数量は0より大きい値を指定してください');
    }

    if (updateData.itemName !== undefined && updateData.itemName.trim() === '') {
      throw new Error('食材名を入力してください');
    }

    if (updateData.itemName !== undefined && updateData.itemName.length > 50) {
      throw new Error('食材名は50文字以内で入力してください');
    }

    if (updateData.date !== undefined && updateData.date > new Date()) {
      throw new Error('未来の日付は指定できません');
    }

    await this.historyRepository.update(historyId, updateData);
  }

  /**
   * 履歴記録を削除する
   * @param historyId 履歴記録ID
   */
  async deleteHistory(historyId: string): Promise<void> {
    await this.historyRepository.delete(historyId);
  }
}
