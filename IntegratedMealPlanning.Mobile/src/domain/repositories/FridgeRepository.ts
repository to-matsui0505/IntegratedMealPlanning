import { FridgeItem } from '../entities/FridgeItem';

/**
 * 冷蔵庫リポジトリインターフェース
 * 冷蔵庫アイテムの永続化を抽象化するインターフェース
 */
export interface FridgeRepository {
  /**
   * アイテムを保存する
   * @param item 保存する冷蔵庫アイテム
   */
  save(item: FridgeItem): Promise<void>;

  /**
   * すべてのアイテムを取得する
   * @returns 全冷蔵庫アイテムのリスト
   */
  findAll(): Promise<FridgeItem[]>;

  /**
   * IDでアイテムを検索する
   * @param id アイテムID
   * @returns 見つかったアイテムまたはnull
   */
  findById(id: string): Promise<FridgeItem | null>;

  /**
   * アイテムを削除する
   * @param id 削除するアイテムのID
   */
  delete(id: string): Promise<void>;
}
