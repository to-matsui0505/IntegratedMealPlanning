# 統合献立作成AIアプリ - スケルトンコード

このディレクトリには、Clean ArchitectureとDDD準拠の設計に基づいた統合献立作成AIアプリのスケルトンコードが含まれています。

## ディレクトリ構造

```
src/
├── domain/                    # ドメイン層
│   ├── entities/             # エンティティ
│   │   ├── FridgeItem.ts     # 冷蔵庫アイテム
│   │   ├── HistoryRecord.ts  # 履歴記録
│   │   ├── MealPlan.ts       # 献立計画
│   │   ├── MealPlanItem.ts   # 献立アイテム
│   │   └── UserAllergen.ts   # ユーザーアレルゲン情報
│   └── repositories/         # リポジトリインターフェース
│       ├── FridgeRepository.ts
│       ├── MealPlanRepository.ts
│       └── HistoryRepository.ts
│
├── application/              # アプリケーション層
│   └── use-cases/           # ユースケース
│       ├── AddItemUseCase.ts
│       ├── RemoveItemUseCase.ts
│       ├── GetCurrentItemsUseCase.ts
│       ├── GetHistoryUseCase.ts
│       ├── AnalyzeImageUseCase.ts
│       ├── CreateMealPlanUseCase.ts
│       ├── GetMealPlanUseCase.ts
│       └── GetMealPlanDetailUseCase.ts
│
├── infrastructure/           # インフラストラクチャ層
│   ├── repositories/        # リポジトリ実装（現在はインメモリ）
│   │   ├── InMemoryFridgeRepository.ts
│   │   ├── InMemoryMealPlanRepository.ts
│   │   └── InMemoryHistoryRepository.ts
│   └── external-services/   # 外部サービス実装（現在はモック）
│       ├── MockAIImageAnalyzer.ts
│       └── MockAIMealPlanGenerator.ts
│
└── presentation/            # プレゼンテーション層
    └── screens/            # 画面コンポーネント
        ├── DashboardScreen.tsx      # ダッシュボード画面
        ├── InputScreen.tsx          # 入力画面
        ├── HistoryScreen.tsx        # 履歴画面
        ├── MealPlanScreen.tsx       # 献立作成画面
        └── MealPlanDetailScreen.tsx # 献立詳細画面
```

## 実装済み機能

### ドメイン層
- **エンティティ**: 全てのドメインエンティティが定義されています
  - FridgeItem（冷蔵庫アイテム）
  - HistoryRecord（履歴記録）
  - MealPlan（献立計画）
  - MealPlanItem（献立アイテム）
  - UserAllergen（ユーザーアレルゲン情報）

- **リポジトリインターフェース**: データ永続化の抽象化
  - FridgeRepository
  - MealPlanRepository
  - HistoryRepository

### アプリケーション層
- **ユースケース**: ビジネスロジックを実装
  - AddItemUseCase: 冷蔵庫にアイテムを追加
  - RemoveItemUseCase: 冷蔵庫からアイテムを削除
  - GetCurrentItemsUseCase: 現在の冷蔵庫の中身を取得
  - GetHistoryUseCase: 履歴を取得
  - AnalyzeImageUseCase: 画像をAI分析
  - CreateMealPlanUseCase: 献立を作成
  - GetMealPlanUseCase: 献立を取得
  - GetMealPlanDetailUseCase: 献立詳細を取得

### インフラストラクチャ層
- **リポジトリ実装**: インメモリ実装（将来的にSQLiteに置き換え予定）
  - InMemoryFridgeRepository
  - InMemoryMealPlanRepository
  - InMemoryHistoryRepository

- **外部サービス**: モック実装（将来的に実際のAIサービスに置き換え予定）
  - MockAIImageAnalyzer: 画像分析のモック
  - MockAIMealPlanGenerator: 献立生成のモック

### プレゼンテーション層
- **画面コンポーネント**: 全ての主要画面が実装されています
  - DashboardScreen: 冷蔵庫の中身一覧
  - InputScreen: アイテム追加フォーム
  - HistoryScreen: 履歴表示
  - MealPlanScreen: 献立作成フォーム
  - MealPlanDetailScreen: 献立詳細表示

## Clean Architectureの原則

このコードベースは以下のClean Architectureの原則に従っています：

1. **依存関係の方向**: 外側の層（UI、DB）は内側の層（ドメイン）に依存
2. **ドメイン層の独立性**: ビジネスロジックは外部の実装詳細に依存しない
3. **インターフェースによる抽象化**: リポジトリパターンで実装詳細を隠蔽
4. **テスタビリティ**: ユースケースは依存性注入により単体テスト可能

## 今後の実装予定

1. **データベース層**:
   - SQLiteを使用した永続化実装
   - マイグレーション管理

2. **外部サービス連携**:
   - 実際のAI画像分析サービスの統合
   - AI献立生成サービスの統合

3. **カメラ機能**:
   - expo-cameraを使用した撮影機能
   - レシートスキャン機能

4. **UI/UX改善**:
   - より洗練されたデザイン
   - アニメーション追加
   - エラーハンドリングの改善

5. **テスト**:
   - ユニットテスト
   - 統合テスト
   - E2Eテスト

## 使用方法

### 開発サーバーの起動
```bash
npm start
```

### リンター実行
```bash
npm run lint
```

### プラットフォーム別起動
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 注意事項

- 現在のリポジトリ実装はインメモリなので、アプリを再起動するとデータが消えます
- AI機能はモック実装なので、実際のAI分析は行われません
- カメラ機能はまだ実装されていません
