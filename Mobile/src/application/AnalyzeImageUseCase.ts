import { FridgeItem } from '../domain/entities/FridgeItem';
import { AIImageAnalyzer } from '../infrastructure/api/AIImageAnalyzer';

export class AnalyzeImageUseCase {
  constructor(private aiImageAnalyzer: AIImageAnalyzer) {}

  async execute(imageData: string, imageId: string): Promise<FridgeItem[]> {
    try {
      const items = await this.aiImageAnalyzer.analyzeImage(imageData, imageId);
      return items;
    } catch (error) {
      console.error('Image analysis failed:', error);
      throw error;
    }
  }
}
