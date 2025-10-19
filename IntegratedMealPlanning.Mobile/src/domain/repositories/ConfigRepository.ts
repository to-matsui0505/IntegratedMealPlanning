import { AzureOpenAIConfig } from '@/src/domain/entities/AzureOpenAIConfig';

/**
 * 設定リポジトリインターフェース
 */
export interface ConfigRepository {
  /**
   * Azure OpenAI設定を取得
   */
  getAzureOpenAIConfig(): Promise<AzureOpenAIConfig>;

  /**
   * Azure OpenAI設定を保存
   */
  saveAzureOpenAIConfig(config: AzureOpenAIConfig): Promise<void>;
}
