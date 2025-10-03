/**
 * 食材バリューオブジェクト
 */
export class Ingredient {
  constructor(
    public readonly name: string,
    public readonly quantity: number,
    public readonly unit: string,
    public readonly inFridge: boolean, // 冷蔵庫にあるかどうか
  ) {}
}
