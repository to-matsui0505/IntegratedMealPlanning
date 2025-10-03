import { AIImageAnalyzer } from '../../infrastructure/services/AIImageAnalyzer';

/**
 * 画像分析結果
 */
export interface AnalysisResult {
  category: string;
  subCategory: string;
  name: string;
  quantity: number;
  unit: string;
}

/**
 * 画像分析ユースケース
 */
export class AnalyzeImageUseCase {
  constructor(private readonly aiImageAnalyzer: AIImageAnalyzer) {}

  async execute(imageUri: string): Promise<AnalysisResult[]> {
    return await this.aiImageAnalyzer.analyze(imageUri);
  }
}
