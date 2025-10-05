import { Activity, ActivityType } from '../../domain/entities/Activity';
import { ActivityRepository } from '../../domain/repositories/ActivityRepository';

export class ActivityRepositoryImpl implements ActivityRepository {
  // モックデータ
  private mockActivities: Activity[] = [
    {
      id: '1',
      type: ActivityType.ADD,
      itemId: '1',
      itemName: 'キャベツ',
      qty: 1,
      userId: 'user1',
      timestamp: new Date('2024-01-15T10:30:00'),
      meta: { location: '冷蔵庫' },
    },
    {
      id: '2',
      type: ActivityType.ADD,
      itemId: '2',
      itemName: '鶏もも肉',
      qty: 300,
      userId: 'user1',
      timestamp: new Date('2024-01-14T15:20:00'),
      meta: { location: '冷蔵庫' },
    },
    {
      id: '3',
      type: ActivityType.USE,
      itemId: '3',
      itemName: '牛乳',
      qty: 200,
      userId: 'user1',
      timestamp: new Date('2024-01-14T08:00:00'),
    },
    {
      id: '4',
      type: ActivityType.ADD,
      itemId: '3',
      itemName: '牛乳',
      qty: 1,
      userId: 'user1',
      timestamp: new Date('2024-01-13T18:45:00'),
    },
    {
      id: '5',
      type: ActivityType.DISCARD,
      itemId: '6',
      itemName: 'レタス',
      qty: 1,
      userId: 'user1',
      timestamp: new Date('2024-01-13T12:00:00'),
      meta: { reason: '傷んでいた' },
    },
    {
      id: '6',
      type: ActivityType.EDIT,
      itemId: '4',
      itemName: '醤油',
      userId: 'user1',
      timestamp: new Date('2024-01-12T20:15:00'),
      meta: { changes: '数量修正' },
    },
    {
      id: '7',
      type: ActivityType.ADD,
      itemId: '5',
      itemName: '人参',
      qty: 3,
      userId: 'user1',
      timestamp: new Date('2024-01-12T09:30:00'),
    },
    {
      id: '8',
      type: ActivityType.MEAL_PLAN,
      itemName: '今週の献立',
      userId: 'user1',
      timestamp: new Date('2024-01-11T19:00:00'),
      meta: { meals: 7 },
    },
  ];

  async findRecent(limit: number): Promise<Activity[]> {
    // 新しい順にソートして指定件数を返す
    return this.mockActivities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async save(_activity: Activity): Promise<void> {
    // TODO: Implement SQLite save logic
  }

  async undo(_id: string): Promise<void> {
    // TODO: Implement undo logic
  }
}
