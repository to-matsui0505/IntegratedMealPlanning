import {
  FridgeItem,
  FridgeItemType,
  FridgeItemSource,
} from '../../domain/entities/FridgeItem';

export interface AIAnalysisResult {
  imageId: string;
  items: Array<{
    category: string;
    subCategory: string;
    name: string;
    quantity: number;
    unit: string;
    confidence: number;
  }>;
  warnings?: string[];
}

export class AIImageAnalyzer {
  private apiEndpoint: string;
  private apiKey: string;

  constructor(apiEndpoint?: string, apiKey?: string) {
    // TODO: Load from secure storage or environment variables
    this.apiEndpoint = apiEndpoint || 'https://api.openai.azure.com';
    this.apiKey = apiKey || '';
  }

  async analyzeImage(
    imageData: string,
    imageId: string,
  ): Promise<FridgeItem[]> {
    try {
      // TODO: Implement actual Azure OpenAI API call
      // For now, return mock data for testing
      const mockResult = await this.mockAnalyze(imageId);
      return this.convertToFridgeItems(mockResult, imageId);
    } catch (error) {
      console.error('AI Image Analysis failed:', error);
      throw new Error('画像解析に失敗しました。もう一度お試しください。');
    }
  }

  private async mockAnalyze(imageId: string): Promise<AIAnalysisResult> {
    // Mock response for testing
    await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));

    return {
      imageId,
      items: [
        {
          category: '野菜類',
          subCategory: '葉物',
          name: 'ほうれん草',
          quantity: 1.5,
          unit: '束',
          confidence: 0.87,
        },
        {
          category: '肉類',
          subCategory: '鶏肉',
          name: '鶏むね肉',
          quantity: 300,
          unit: 'g',
          confidence: 0.92,
        },
      ],
      warnings: ['一部数値は推定です'],
    };
  }

  private convertToFridgeItems(
    result: AIAnalysisResult,
    sourceImageId: string,
  ): FridgeItem[] {
    return result.items.map((item, index) => ({
      id: `${result.imageId}_${index}`,
      type: FridgeItemType.IN,
      category: item.category,
      subCategory: item.subCategory,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      source: FridgeItemSource.CAMERA,
      sourceImageId,
      updatedAt: new Date(),
    }));
  }
}
