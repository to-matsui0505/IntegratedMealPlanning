/**
 * Azure OpenAI設定エンティティ
 */
export interface AzureOpenAIConfig {
  /** エンドポイントURL */
  endpoint: string;
  /** アクセスキー */
  apiKey: string;
  /** モデル名 */
  modelName: string;
  /** APIバージョン */
  apiVersion: string;
  /** タイムアウト時間（秒） */
  timeoutSeconds: number;
}

/**
 * デフォルトのAzure OpenAI設定
 */
export const DEFAULT_AZURE_OPENAI_CONFIG: AzureOpenAIConfig = {
  endpoint: '',
  apiKey: '',
  modelName: 'gpt-4o',
  apiVersion: '2024-02-15-preview',
  timeoutSeconds: 30,
};
