# カメラ撮影による食材入力機能

## 概要
カメラで撮影した食材画像をAI（Azure OpenAI）で解析し、自動的に食材情報を認識・登録する機能です。

## 画面遷移フロー

```
ダッシュボード画面（DashboardScreen）
  ↓ 「+ 食材追加」ボタンをタップ
入力方法選択画面（InputScreen）
  ↓ 「方法① カメラ撮影」を選択
カメラ撮影画面（InputCameraScreen）
  ↓ 撮影 → AI解析 → 編集 → 保存
ダッシュボード画面に戻る
```

## 機能概要

### 1. カメラ撮影
- カメラ権限の確認と要求
- 食材の写真撮影
- 撮影画像のプレビュー表示

### 2. AI画像解析
- Azure OpenAIを使用した画像解析
- 食材の自動認識（大分類、小分類、名称、数量、単位）
- 信頼度スコアの取得

### 3. 結果の編集
- 認識結果の表示
- 各項目の手動編集機能
- 不要な項目の削除
- 数量と単位の調整

### 4. データ保存
- SQLiteへの一括保存
- 食材入庫履歴の自動生成
- 一時画像の自動削除

### 5. 連続入力
- 保存後に連続入力の選択
- ダッシュボードへの戻る機能

## アーキテクチャ

### Clean Architectureに基づく実装

```
presentation/
  └── screens/
      ├── InputScreen.tsx          # 入力方法選択画面
      └── InputCameraScreen.tsx    # カメラ撮影画面

application/
  └── AnalyzeImageUseCase.ts       # 画像解析ユースケース

domain/
  └── entities/
      └── FridgeItem.ts            # 食材エンティティ（source, sourceImageId追加）

infrastructure/
  ├── api/
  │   └── AIImageAnalyzer.ts       # AI画像解析APIクライアント
  └── storage/
      └── ImageTempStore.ts        # 一時画像保存

interfaces/
  └── camera/
      └── CameraDevice.ts          # カメラデバイス操作
```

## 使用方法

### 1. 入力画面から開始
```typescript
// InputScreenで「方法① カメラ撮影」を選択
```

### 2. カメラ撮影
```typescript
// InputCameraScreenで「📷 撮影する」ボタンをタップ
// カメラが起動し、食材を撮影
```

### 3. AI解析
```typescript
// 撮影後、自動的にAI解析が開始
// 解析中はローディングインジケーターが表示
```

### 4. 結果確認・編集
```typescript
// 認識された食材リストが表示
// 必要に応じて各項目を編集
// 不要な項目は削除
```

### 5. 保存
```typescript
// 「確定して保存」ボタンで保存
// 保存後、連続入力 or ダッシュボードへ戻るを選択
```

## データ構造

### FridgeItem
```typescript
interface FridgeItem {
  id: string;
  type: FridgeItemType;           // '入庫' | '出庫'
  category: string;               // 大分類（例：野菜類、肉類）
  subCategory: string;            // 小分類（例：葉物、鶏肉）
  name: string;                   // 名称（例：ほうれん草）
  quantity: number;               // 数量
  unit: string;                   // 単位（例：束、g）
  source?: FridgeItemSource;      // 'CAMERA' | 'RECEIPT' | 'MANUAL'
  sourceImageId?: string;         // 元画像ID
  updatedAt: Date;                // 更新日時
}
```

### AI解析結果
```typescript
interface AIAnalysisResult {
  imageId: string;
  items: Array<{
    category: string;
    subCategory: string;
    name: string;
    quantity: number;
    unit: string;
    confidence: number;           // 信頼度 (0.0 - 1.0)
  }>;
  warnings?: string[];            // 警告メッセージ
}
```

## エラーハンドリング

### カメラ権限エラー
- 権限がない場合、説明ダイアログを表示
- 設定画面への誘導

### 画像解析エラー
- タイムアウト、ネットワークエラーへの対応
- 手動入力への切り替え案内
- 再試行機能

### 保存エラー
- トランザクションによるデータ整合性確保
- ユーザーへのエラー通知
- ロールバック処理

## テスト

### ユニットテスト
```bash
npm test
```

以下のテストが含まれています：
- AnalyzeImageUseCaseのテスト
- ImageTempStoreのテスト
- CameraDeviceのテスト

### カバレッジ
- 全テスト合格
- 主要なビジネスロジックをカバー

## 今後の拡張

### 実装予定
1. 実際のカメラライブラリ統合（react-native-camera）
2. Azure OpenAI API接続
3. オフライン対応
4. 画像圧縮・最適化
5. バッチ処理の最適化

### 改善予定
1. UI/UXの改善
2. パフォーマンス最適化
3. エラーハンドリングの拡充
4. アクセシビリティ対応

## 設計ドキュメント

詳細な設計については以下のドキュメントを参照：
- `CopilotInstructions/InputFromItemPhotoDesign.md`
- `CopilotInstructions/ApplicationBasicDesign.md`
