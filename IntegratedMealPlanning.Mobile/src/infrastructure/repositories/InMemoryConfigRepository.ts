import { ConfigRepository } from '@/src/domain/repositories/ConfigRepository';
import {
  AzureOpenAIConfig,
  DEFAULT_AZURE_OPENAI_CONFIG,
} from '@/src/domain/entities/AzureOpenAIConfig';

/**
 * 設定リポジトリのインメモリ実装
 * 将来的にAsyncStorage等の永続化ストレージに置き換え可能
 */
export class InMemoryConfigRepository implements ConfigRepository {
  private azureOpenAIConfig: AzureOpenAIConfig = { ...DEFAULT_AZURE_OPENAI_CONFIG };

  async getAzureOpenAIConfig(): Promise<AzureOpenAIConfig> {
    return { ...this.azureOpenAIConfig };
  }

  async saveAzureOpenAIConfig(config: AzureOpenAIConfig): Promise<void> {
    this.azureOpenAIConfig = { ...config };
  }
}
