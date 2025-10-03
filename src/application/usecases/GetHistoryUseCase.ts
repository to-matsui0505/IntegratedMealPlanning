import { HistoryRecord } from '../../domain/entities/HistoryRecord';
import { HistoryRepository } from '../../domain/repositories/HistoryRepository';

/**
 * 履歴取得ユースケース
 */
export class GetHistoryUseCase {
  constructor(private readonly historyRepository: HistoryRepository) {}

  async execute(): Promise<HistoryRecord[]> {
    return await this.historyRepository.findAll();
  }
}
