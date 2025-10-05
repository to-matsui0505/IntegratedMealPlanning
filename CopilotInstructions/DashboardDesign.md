// ...existing code...
# ダッシュボード機能 設計書

## 概要
ダッシュボードはユーザが冷蔵庫の現状を一目で把握し、素早く操作（食材入力・献立作成）できるハブ画面です。本設計書は表示要素、API、データモデル、振る舞い、検証要件を定義します。

## 対象範囲
- 食材の分類別在庫を円グラフで表示
- 最近の在庫増減をアクティビティ（履歴）として表示
- 食材の在庫をリスト表示（品名・数量など）
- 食材入力ボタン、献立作成ボタンを固定表示（他機能をオーバーレイ）

## 利用者ゴール
- 何が冷蔵庫にあるか素早く把握する
- 不足を把握するする
- 新しい食材の登録・献立作成を短時間で始められる

## 機能要件（機能一覧）
1. 円グラフ表示
   - 分類（例：野菜、肉、乳製品、調味料）ごとの数量または品目数を表示
   - 凡例・ツールチップで詳細を表示（割合、件数）
2. 最近のアクティビティ
   - 項目: timestamp, type(add/use/discard/edit), itemName, qty, user, 操作ボタン(元に戻す/詳細)
   - 初期表示は最新10件、詳細は履歴画面へ遷移
3. 在庫リスト
   - 各行: 品名、数量、単位、カテゴリ、操作（編集/消費/削除）
   - ソート: 数量順、追加日時順
4. 操作ボタン（固定・オーバーレイ）
   - 食材入力（Primary、右下固定、モーダルで入力/バーコード/写真）
   - 献立作成（Secondary、モーダル／遷移でウィザード）
   - 両ボタンは他UI要素の上に重ねて表示（z-index）、スクロール追従

## 非機能要件
- レスポンシブ（デスクトップ／タブレット／スマホ）
- アクセシビリティ（キーボード操作、スクリーンリーダ対応）
- 表示遅延 < 300ms（キャッシュ/Optimistic UIを利用）
- 多人数環境でのリアルタイム反映（オプション：WebSocket/Push）

## データモデル（抜粋）
- FridgeItem
  - id, name, category, qty, unit, location, updatedAt
- Activity
  - id, type("add"|"use"|"discard"|"edit"|"meal_plan"), itemId?, itemName, qty?, userId, timestamp, meta
- Summary (計算ビュー)
  - category, itemCount, totalQty

## API（例）
- GET /api/fridge/summary
  - レスポンス: [{ category, itemCount, totalQty }]
- GET /api/fridge/items?sort=qty&limit=100
- GET /api/activities?limit=10
- POST /api/fridge/items
  - body: { name, category, qty, unit, location }
- POST /api/mealplans
  - body: { name, dateRange, items[] }
- POST /api/activities/{id}/undo

## UI/UX（画面構成）
- 上段: サマリーカード（合計品目数、カテゴリ数）
- 左/上: 円グラフ（カテゴリ別）
- 右/下: 最近のアクティビティリスト（アイコン＋色）
- 下/中央または右下: 在庫リスト（テーブル／カード）
- 右下浮遊: 操作ボタン群（食材入力（目立つ色）・献立作成）
- モーダルは背景をセミ透過で覆い、フォーカスをトラップ

## 振る舞いフロー（例）
- 食材追加:
  1. ボタン → モーダル入力 → POST /api/fridge/items
  2. 成功: Activity作成、UIはOptimisticに更新
- 献立作成:
  1. ボタン → ウィザード（利用可能な食材をプリセレクト） → POST /api/mealplans
  2. 関連アイテムに消費予定フラグを付与
- 元に戻す:
  - POST /api/activities/{id}/undo（可能な操作のみ）

## リアルタイム更新
- WebSocket / Server-Sent Events を用いて他端末・共同ユーザの変更を即時反映（Activity と items の差分配信）

## テストケース（抜粋）
- 円グラフがカテゴリ比率を正しく表示する（モックデータ）
- 直近アクティビティが10件表示される・「元に戻す」が機能する
- 食材追加モーダルのバリデーション（必須項目、数値フォーマット）
- ボタンがオーバーレイで常に見える（スクロールテスト）
- キーボード操作でモーダルを開閉・操作できる

## 実装上の注意点
- 大量データ時はサーバサイドで集計（Summary エンドポイント）して円グラフに渡す
- Optimistic UI とサーバ検証の整合性（失敗時はロールバックUI）
- 活動ログは不変（参照整合を保つために itemName をキャプチャ）
- プライバシー: userId を含むログは認可制御する