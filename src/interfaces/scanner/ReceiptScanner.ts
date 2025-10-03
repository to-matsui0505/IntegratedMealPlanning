import { AnalysisResult } from '../../application/usecases/AnalyzeImageUseCase';

/**
 * レシートスキャナーインターフェース
 */
export interface ReceiptScanner {
  scan(imageUri: string): Promise<AnalysisResult[]>;
}

/**
 * レシートスキャナー実装
 */
export class ReceiptScannerImpl implements ReceiptScanner {
  async scan(imageUri: string): Promise<AnalysisResult[]> {
    // TODO: レシート認識APIとの連携を実装
    console.log('Scanning receipt:', imageUri);
    
    // 仮の実装: 空の配列を返す
    return [];
  }
}
