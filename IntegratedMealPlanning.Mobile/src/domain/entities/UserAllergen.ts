/**
 * ユーザーアレルゲン情報エンティティ
 * ユーザーのアレルギー情報を表現するドメインエンティティ
 */
export interface UserAllergen {
  /** アレルゲンID */
  id: string;
  /** ユーザーID */
  userId: string;
  /** アレルゲン名 */
  allergenName: string;
}
