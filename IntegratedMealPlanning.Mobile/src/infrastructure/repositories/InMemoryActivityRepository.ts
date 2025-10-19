import { Activity, ActivityType } from '@/src/domain/entities/Activity';
import { ActivityRepository } from '@/src/domain/repositories/ActivityRepository';

/**
 * アクティビティリポジトリのインメモリ実装
 * 実際のアプリではSQLiteを使用する予定
 */
export class InMemoryActivityRepository implements ActivityRepository {
  private activities: Map<string, Activity> = new Map();

  constructor() {
    // デモ用のサンプルデータを初期化
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleActivities: Activity[] = [
      {
        id: '1',
        type: ActivityType.ADD,
        itemId: '1',
        itemName: 'キャベツ',
        qty: 1,
        userId: 'user1',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        meta: { category: '野菜類' },
      },
      {
        id: '2',
        type: ActivityType.ADD,
        itemId: '2',
        itemName: 'にんじん',
        qty: 3,
        userId: 'user1',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        meta: { category: '野菜類' },
      },
      {
        id: '3',
        type: ActivityType.USE,
        itemId: '3',
        itemName: '豚バラ肉',
        qty: 200,
        userId: 'user1',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        meta: { category: '肉類' },
      },
      {
        id: '4',
        type: ActivityType.ADD,
        itemId: '4',
        itemName: '鶏もも肉',
        qty: 400,
        userId: 'user1',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        meta: { category: '肉類' },
      },
      {
        id: '5',
        type: ActivityType.ADD,
        itemId: '5',
        itemName: '牛乳',
        qty: 1,
        userId: 'user1',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        meta: { category: '乳製品' },
      },
      {
        id: '6',
        type: ActivityType.USE,
        itemId: '8',
        itemName: 'ネギ',
        qty: 1,
        userId: 'user1',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        meta: { category: '野菜類' },
      },
      {
        id: '7',
        type: ActivityType.MEAL_PLAN,
        itemName: '今週の献立',
        userId: 'user1',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        meta: { days: 7 },
      },
      {
        id: '8',
        type: ActivityType.ADD,
        itemId: '8',
        itemName: 'ネギ',
        qty: 2,
        userId: 'user1',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        meta: { category: '野菜類' },
      },
    ];

    sampleActivities.forEach((activity) => {
      this.activities.set(activity.id, activity);
    });
  }

  async save(activity: Activity): Promise<void> {
    this.activities.set(activity.id, activity);
  }

  async findRecent(limit: number): Promise<Activity[]> {
    const allActivities = Array.from(this.activities.values());
    // 新しい順にソート
    return allActivities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async findAll(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async findById(id: string): Promise<Activity | null> {
    return this.activities.get(id) || null;
  }
}
