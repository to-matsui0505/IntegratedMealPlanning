import { Activity } from '@/src/domain/entities/Activity';
import { ActivityRepository } from '@/src/domain/repositories/ActivityRepository';

/**
 * 最近のアクティビティ取得ユースケース
 * 最近の冷蔵庫や献立に関する操作履歴を取得する
 */
export class GetRecentActivitiesUseCase {
  constructor(private activityRepository: ActivityRepository) {}

  /**
   * 最近のアクティビティを取得する
   * @param limit 取得する最大件数（デフォルト: 10）
   * @returns アクティビティのリスト（新しい順）
   */
  async execute(limit: number = 10): Promise<Activity[]> {
    return await this.activityRepository.findRecent(limit);
  }
}
