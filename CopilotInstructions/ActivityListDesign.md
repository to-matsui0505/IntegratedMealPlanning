# アクティビティ一覧画面 設計書

## 概要
アクティビティ一覧画面は、冷蔵庫や献立に関するすべての操作履歴を時系列で表示する画面です。ダッシュボードの「もっと見る」リンクから遷移します。

## 対象範囲
- すべてのアクティビティを時系列で表示
- アクティビティのフィルタリング機能
- アクティビティの検索機能
- 各アクティビティの詳細表示

## 利用者ゴール
- 過去の操作履歴を確認する
- 特定の期間や操作種別でフィルタリングする
- 操作の詳細を確認する

## 画面構成

### ヘッダー
- タイトル: 「アクティビティ一覧」
- 戻るボタン（ダッシュボードへ）
- フィルタボタン

### フィルタバー
- 操作種別フィルタ
  - すべて
  - 追加
  - 使用
  - 破棄
  - 編集
  - 献立作成
- 期間フィルタ
  - 今日
  - 過去7日間
  - 過去30日間
  - カスタム期間

### アクティビティリスト
- 各アクティビティカード
  - アイコン（操作種別）
  - 操作種別ラベル
  - アイテム名
  - 数量（該当する場合）
  - タイムスタンプ（日付と時刻）
  - ユーザー名（該当する場合）

### 詳細表示（モーダルまたはダイアログ）
- アクティビティの完全な詳細情報
- メタデータ情報
- 関連するアイテムへのリンク

## データモデル

### Activity（再掲）
```typescript
interface Activity {
  id: string;
  type: ActivityType; // add, use, discard, edit, meal_plan
  itemId?: string;
  itemName: string;
  qty?: number;
  userId: string;
  timestamp: Date;
  meta?: Record<string, any>;
}
```

### Filter
```typescript
interface ActivityFilter {
  types?: ActivityType[];
  startDate?: Date;
  endDate?: Date;
  searchQuery?: string;
}
```

## API

### アクティビティ一覧取得
```
GET /api/activities
Query Parameters:
  - type: ActivityType[] (optional)
  - startDate: ISO8601 string (optional)
  - endDate: ISO8601 string (optional)
  - search: string (optional)
  - page: number (default: 1)
  - limit: number (default: 20)

Response:
{
  activities: Activity[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
```

### アクティビティ詳細取得
```
GET /api/activities/{id}

Response:
Activity
```

## UI/UX

### レイアウト
- フルスクリーン表示
- スクロール可能なリスト
- プルトゥリフレッシュ対応
- 無限スクロール（ページネーション）

### インタラクション
- タップでアクティビティ詳細を表示
- スワイプジェスチャー（オプション）
- フィルタボタンタップでフィルタモーダル表示

### 空状態
- アクティビティがない場合
  - メッセージ: 「アクティビティがありません」
  - イラストまたはアイコン
- フィルタ結果が0件の場合
  - メッセージ: 「条件に一致するアクティビティがありません」
  - フィルタをクリアするボタン

## 非機能要件
- 表示速度: 初回ロード < 500ms
- スクロール性能: 60fps維持
- メモリ使用量: 仮想スクロール実装で最適化
- オフライン対応: キャッシュからの表示

## テストケース
- アクティビティが時系列順（新しい順）に表示される
- フィルタが正しく動作する
- 検索機能が正しく動作する
- ページネーションが正しく動作する
- プルトゥリフレッシュでデータが更新される
- 詳細モーダルが正しく表示される
- 空状態が適切に表示される

## 実装上の注意点
- 大量データの効率的な表示（仮想スクロール）
- フィルタ条件の永続化（ローカルストレージ）
- 検索のデバウンス処理
- エラーハンドリング（ネットワークエラー等）

## 関連画面
- ダッシュボード画面
- アイテム詳細画面（アクティビティから遷移）
