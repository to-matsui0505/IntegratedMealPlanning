# アーキテクチャ構造

このディレクトリは、Clean ArchitectureとDDD（ドメイン駆動設計）に基づいて構成されています。

## ディレクトリ構成

### application/
UseCaseレイヤー - ビジネスロジックの実行フローを定義します。

- `AddItemUseCase` - 冷蔵庫に食材を追加
- `RemoveItemUseCase` - 冷蔵庫から食材を削除
- `GetCurrentItemsUseCase` - 現在の冷蔵庫の中身を取得
- `GetHistoryUseCase` - 履歴を取得
- `AnalyzeImageUseCase` - 画像解析による食材認識
- `CreateMealPlanUseCase` - 献立を作成
- `GetMealPlanUseCase` - 献立一覧を取得
- `GetMealPlanDetailUseCase` - 献立詳細を取得

### domain/
ドメインレイヤー - エンティティ、バリューオブジェクト、リポジトリインターフェースなど。

#### entities/
- `FridgeItem` - 冷蔵庫の食材エンティティ
- `HistoryRecord` - 履歴記録エンティティ
- `MealPlan` - 献立エンティティ
- `MealPlanItem` - 献立項目エンティティ
- `UserAllergen` - ユーザーアレルゲンエンティティ

#### repositories/
- `FridgeRepository` - 冷蔵庫リポジトリインターフェース
- `MealPlanRepository` - 献立リポジトリインターフェース

### infrastructure/
インフラストラクチャレイヤー - DB、外部API実装など。

#### database/
- `FridgeRepositoryImpl` - 冷蔵庫リポジトリの実装（SQLite）
- `MealPlanRepositoryImpl` - 献立リポジトリの実装（SQLite）

#### api/
- `AIImageAnalyzer` - AI画像解析サービス
- `AIMealPlanGenerator` - AI献立生成サービス

### interfaces/
インターフェースレイヤー - UIや外部デバイスとのIF。

#### camera/
- `CameraDevice` - カメラデバイス操作
- `ReceiptScanner` - レシートスキャン機能

### presentation/
プレゼンテーションレイヤー - React Nativeコンポーネント（UI層）。

#### screens/
- `DashboardScreen` - ダッシュボード画面
- `InputScreen` - 食材登録画面
- `HistoryScreen` - 履歴画面
- `MealPlanScreen` - 献立作成画面
- `MealPlanDetailScreen` - 献立詳細画面

### utils/
共通ユーティリティ関数。

## アーキテクチャの特徴

- **Clean Architecture** による依存関係の制御
- **DDD** によるドメイン駆動設計
- レイヤー間の疎結合
- テスタビリティの向上
- 保守性・拡張性の確保
