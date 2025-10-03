/**
 * アレルゲンエンティティ
 */
export class Allergen {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly enabled: boolean,
  ) {}
}
