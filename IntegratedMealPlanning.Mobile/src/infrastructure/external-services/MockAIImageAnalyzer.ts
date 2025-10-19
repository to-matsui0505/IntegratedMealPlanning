import {
  AIImageAnalyzer,
  ImageAnalysisResult,
} from '@/src/application/use-cases/AnalyzeImageUseCase';

/**
 * AI画像分析サービスのモック実装
 * 実際のアプリでは外部AIサービスを使用する予定
 */
export class MockAIImageAnalyzer implements AIImageAnalyzer {
  async analyzeImage(imageUri: string): Promise<ImageAnalysisResult> {
    // モック実装: 実際のAI分析の代わりにダミーデータを返す
    console.log('Analyzing image:', imageUri);

    // 実際の実装では、外部AIサービスAPIを呼び出す
    return {
      items: [
        {
          category: '野菜類',
          subCategory: '葉物野菜',
          name: 'レタス',
          quantity: 1,
          unit: '個',
          confidence: 0.95,
        },
        {
          category: '野菜類',
          subCategory: '根菜',
          name: 'にんじん',
          quantity: 2,
          unit: '本',
          confidence: 0.88,
        },
      ],
    };
  }
}
