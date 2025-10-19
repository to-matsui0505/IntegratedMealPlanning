import {
  AIImageAnalyzer,
  ImageAnalysisResult,
} from '@/src/application/use-cases/AnalyzeImageUseCase';
import { ConfigRepository } from '@/src/domain/repositories/ConfigRepository';
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Azure OpenAIを使用した画像分析サービスの実装
 */
export class AzureOpenAIImageAnalyzer implements AIImageAnalyzer {
  constructor(private configRepository: ConfigRepository) {}

  async analyzeImage(imageUri: string): Promise<ImageAnalysisResult> {
    // 設定を取得
    const config = await this.configRepository.getAzureOpenAIConfig();

    // 設定のバリデーション
    if (!config.endpoint || !config.apiKey) {
      throw new Error('Azure OpenAI の設定が完了していません。「その他」タブから設定を行ってください。');
    }

    try {
      // 画像をBase64にエンコード（ImageManipulatorを使用）
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [],
        { 
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true 
        }
      );

      if (!manipulatedImage.base64) {
        throw new Error('画像のBase64変換に失敗しました');
      }

      const base64Image = manipulatedImage.base64;

      // Azure OpenAI APIにリクエスト
      const endpoint = `${config.endpoint}/openai/deployments/${config.modelName}/chat/completions?api-version=${config.apiVersion}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeoutSeconds * 1000);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': config.apiKey,
          },
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content: `あなたは食材認識のエキスパートです。画像から食材を認識し、以下のJSON形式で返却してください。
{
  "items": [
    {
      "category": "大分類（肉類、野菜類、果物、魚介類、乳製品、卵、豆類、穀類、調味料、飲料、酒類、加工食品、その他のいずれか）",
      "subCategory": "小分類（大分類に応じた詳細分類）",
      "name": "食材名",
      "quantity": 数量（数値）,
      "unit": "単位（個、本、束、パック、袋、g、kg、ml、L、枚、切れ、セット、その他のいずれか）",
      "confidence": 信頼度（0.0-1.0の小数）
    }
  ]
}`,
              },
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'この画像に写っている食材を認識して、JSON形式で返却してください。',
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:image/jpeg;base64,${base64Image}`,
                    },
                  },
                ],
              },
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Azure OpenAI API エラー (${response.status}): ${errorText}`);
        }

        const data = await response.json();

        // レスポンスからコンテンツを取得
        const content = data.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error('Azure OpenAI から有効なレスポンスが得られませんでした');
        }

        // JSONを抽出（マークダウンコードブロックの場合は除去）
        let jsonContent = content.trim();
        if (jsonContent.startsWith('```json')) {
          jsonContent = jsonContent.replace(/```json\s*\n?/g, '').replace(/\n?```\s*$/g, '');
        } else if (jsonContent.startsWith('```')) {
          jsonContent = jsonContent.replace(/```\s*\n?/g, '').replace(/\n?```\s*$/g, '');
        }

        // JSONをパース
        const result = JSON.parse(jsonContent);

        // バリデーション
        if (!result.items || !Array.isArray(result.items)) {
          throw new Error('Azure OpenAI のレスポンス形式が正しくありません');
        }

        return {
          items: result.items.map((item: any) => ({
            category: item.category || '',
            subCategory: item.subCategory || '',
            name: item.name || '',
            quantity: Number(item.quantity) || 1,
            unit: item.unit || '個',
            confidence: Number(item.confidence) || 0.5,
          })),
        };
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error(`タイムアウトしました（${config.timeoutSeconds}秒）`);
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Azure OpenAI image analysis error:', error);
      throw new Error(`画像解析エラー: ${error.message}`);
    }
  }
}
