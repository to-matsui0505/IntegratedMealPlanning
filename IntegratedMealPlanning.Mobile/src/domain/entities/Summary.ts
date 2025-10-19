/**
 * サマリーエンティティ
 * カテゴリ別の在庫サマリーを表現するドメインエンティティ
 */
export interface Summary {
  /** カテゴリ名 */
  category: string;
  /** アイテム数 */
  itemCount: number;
  /** 合計数量 */
  totalQty: number;
}
