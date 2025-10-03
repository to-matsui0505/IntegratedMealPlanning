import { AnalysisResult } from '../../application/usecases/AnalyzeImageUseCase';
import { CameraDevice } from '../../interfaces/camera/CameraDevice';
import { ReceiptScanner } from '../../interfaces/scanner/ReceiptScanner';

/**
 * AI画像分析サービス
 */
export class AIImageAnalyzer {
  constructor(
    private readonly cameraDevice: CameraDevice,
    private readonly receiptScanner: ReceiptScanner,
  ) {}

  async analyze(imageUri: string): Promise<AnalysisResult[]> {
    // TODO: AI画像認識APIとの連携を実装
    console.log('Analyzing image:', imageUri);
    
    // 仮の実装: 空の配列を返す
    return [];
  }

  async analyzeReceipt(imageUri: string): Promise<AnalysisResult[]> {
    // TODO: レシート認識APIとの連携を実装
    console.log('Analyzing receipt:', imageUri);
    
    // 仮の実装: receiptScannerを使用
    return await this.receiptScanner.scan(imageUri);
  }
}
