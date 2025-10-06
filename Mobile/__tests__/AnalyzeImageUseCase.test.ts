import { AnalyzeImageUseCase } from '../src/application/AnalyzeImageUseCase';
import { AIImageAnalyzer } from '../src/infrastructure/api/AIImageAnalyzer';
import {
  FridgeItemType,
  FridgeItemSource,
} from '../src/domain/entities/FridgeItem';

describe('AnalyzeImageUseCase', () => {
  it('should analyze image and return FridgeItems', async () => {
    const mockAnalyzer = new AIImageAnalyzer();
    const useCase = new AnalyzeImageUseCase(mockAnalyzer);

    const result = await useCase.execute('/path/to/image.jpg', 'test_image_1');

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    const firstItem = result[0];
    expect(firstItem.id).toBeDefined();
    expect(firstItem.type).toBe(FridgeItemType.IN);
    expect(firstItem.category).toBeDefined();
    expect(firstItem.name).toBeDefined();
    expect(firstItem.quantity).toBeGreaterThan(0);
    expect(firstItem.source).toBe(FridgeItemSource.CAMERA);
  });

  it('should handle errors gracefully', async () => {
    const mockAnalyzer = {
      analyzeImage: jest.fn().mockRejectedValue(new Error('API Error')),
    } as unknown as AIImageAnalyzer;

    const useCase = new AnalyzeImageUseCase(mockAnalyzer);

    await expect(
      useCase.execute('/path/to/image.jpg', 'test_image_1'),
    ).rejects.toThrow();
  });
});
