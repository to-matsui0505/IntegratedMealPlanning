import { Activity } from '../entities/Activity';

export interface ActivityRepository {
  findRecent(limit: number): Promise<Activity[]>;
  save(activity: Activity): Promise<void>;
  undo(id: string): Promise<void>;
}
