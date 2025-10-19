/**
 * 画像分析結果の型定義
 */
export interface ImageAnalysisResult {
  /** 認識されたアイテムリスト */
  items: {
    category: string;
    subCategory: string;
    name: string;
    quantity: number;
    unit: string;
    confidence: number;
  }[];
}

/**
 * AI画像分析サービスのインターフェース
 */
export interface AIImageAnalyzer {
  /**
   * 画像を分析して食材を識別する
   * @param imageUri 画像のURI
   * @returns 分析結果
   */
  analyzeImage(imageUri: string): Promise<ImageAnalysisResult>;
}

/**
 * 画像分析ユースケース
 * カメラ撮影した画像をAI分析して食材情報を取得する
 */
export class AnalyzeImageUseCase {
  constructor(private aiImageAnalyzer: AIImageAnalyzer) {}

  /**
   * 画像を分析して食材情報を取得する
   * @param imageUri 画像のURI
   * @returns 分析結果
   */
  async execute(imageUri: string): Promise<ImageAnalysisResult> {
    if (!imageUri || imageUri.trim() === '') {
      throw new Error('画像URIが指定されていません');
    }

    return await this.aiImageAnalyzer.analyzeImage(imageUri);
  }
}
