import { Summary } from '../domain/entities/Summary';
import { FridgeRepository } from '../domain/repositories/FridgeRepository';

export class GetSummaryUseCase {
  constructor(private fridgeRepository: FridgeRepository) {}

  async execute(): Promise<Summary[]> {
    return await this.fridgeRepository.getSummary();
  }
}
