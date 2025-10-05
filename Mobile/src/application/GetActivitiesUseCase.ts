import { Activity } from '../domain/entities/Activity';
import { ActivityRepository } from '../domain/repositories/ActivityRepository';

export class GetActivitiesUseCase {
  constructor(private activityRepository: ActivityRepository) {}

  async execute(limit: number = 10): Promise<Activity[]> {
    return await this.activityRepository.findRecent(limit);
  }
}
