import { Allergen } from '../../domain/entities/Allergen';
import { AllergenRepository } from '../../domain/repositories/AllergenRepository';

/**
 * アレルゲン管理ユースケース
 */
export class ManageAllergensUseCase {
  constructor(private readonly allergenRepository: AllergenRepository) {}

  async getAll(): Promise<Allergen[]> {
    return await this.allergenRepository.findAll();
  }

  async save(name: string, enabled: boolean): Promise<void> {
    const allergen = new Allergen(
      this.generateId(),
      name,
      enabled,
    );
    await this.allergenRepository.save(allergen);
  }

  async delete(id: string): Promise<void> {
    await this.allergenRepository.delete(id);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
