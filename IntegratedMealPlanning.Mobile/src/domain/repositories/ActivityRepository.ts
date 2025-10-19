import { Activity } from '../entities/Activity';

/**
 * アクティビティリポジトリインターフェース
 * アクティビティ記録の永続化を抽象化するインターフェース
 */
export interface ActivityRepository {
  /**
   * アクティビティを保存する
   * @param activity 保存するアクティビティ
   */
  save(activity: Activity): Promise<void>;

  /**
   * 最近のアクティビティを取得する
   * @param limit 取得する最大件数
   * @returns アクティビティのリスト（新しい順）
   */
  findRecent(limit: number): Promise<Activity[]>;

  /**
   * すべてのアクティビティを取得する
   * @returns 全アクティビティのリスト
   */
  findAll(): Promise<Activity[]>;

  /**
   * IDでアクティビティを検索する
   * @param id アクティビティID
   * @returns 見つかったアクティビティまたはnull
   */
  findById(id: string): Promise<Activity | null>;
}
