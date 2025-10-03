# アーキテクチャドキュメント

## Clean Architecture実装

このプロジェクトは、Clean Architectureの原則に従って実装されています。

### レイヤー構造

```
┌─────────────────────────────────────────────────┐
│           Presentation Layer (UI)               │
│        src/presentation/screens/                │
│  - DashboardScreen.tsx                          │
│  - InputScreen.tsx                              │
│  - HistoryScreen.tsx                            │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Application Layer (Use Cases)           │
│        src/application/usecases/                │
│  - AddItemUseCase.ts                            │
│  - RemoveItemUseCase.ts                         │
│  - GetCurrentItemsUseCase.ts                    │
│  - GetHistoryUseCase.ts                         │
│  - AnalyzeImageUseCase.ts                       │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│              Domain Layer                       │
│           src/domain/                           │
│  entities/                                      │
│    - FridgeItem.ts                              │
│    - HistoryRecord.ts                           │
│  valueobjects/                                  │
│    - TransactionType.ts                         │
│    - ChangeType.ts                              │
│  repositories/ (interfaces)                     │
│    - FridgeRepository.ts                        │
│    - HistoryRepository.ts                       │
└─────────────────────────────────────────────────┘
                      ↑
┌─────────────────────────────────────────────────┐
│        Infrastructure Layer                     │
│        src/infrastructure/                      │
│  database/                                      │
│    - SQLiteFridgeRepository.ts                  │
│    - SQLiteHistoryRepository.ts                 │
│  services/                                      │
│    - AIImageAnalyzer.ts                         │
└─────────────────────────────────────────────────┘
                      ↑
┌─────────────────────────────────────────────────┐
│          Interfaces Layer                       │
│         src/interfaces/                         │
│  camera/                                        │
│    - CameraDevice.ts                            │
│  scanner/                                       │
│    - ReceiptScanner.ts                          │
└─────────────────────────────────────────────────┘
```

## 依存関係の方向

- **Presentation → Application → Domain**
- **Infrastructure → Domain** (implements interfaces)
- **Interfaces → Domain** (implements interfaces)

Domain層は他のどのレイヤーにも依存しません（依存性逆転の原則）。

## コンポーネント説明

### Domain層（ビジネスロジックの核心）

#### Entities
- **FridgeItem**: 冷蔵庫のアイテムを表すエンティティ
- **HistoryRecord**: 履歴レコードを表すエンティティ

#### Value Objects
- **TransactionType**: 入庫/出庫の種類
- **ChangeType**: 増加/減少の種類

#### Repository Interfaces
- **FridgeRepository**: 冷蔵庫アイテムの永続化インターフェース
- **HistoryRepository**: 履歴レコードの永続化インターフェース

### Application層（ユースケース）

- **AddItemUseCase**: アイテムを追加
- **RemoveItemUseCase**: アイテムを削除
- **GetCurrentItemsUseCase**: 現在のアイテム一覧を取得
- **GetHistoryUseCase**: 履歴を取得
- **AnalyzeImageUseCase**: 画像を分析

### Infrastructure層（技術詳細）

#### Database
- **SQLiteFridgeRepository**: SQLiteを使用したFridgeRepositoryの実装
- **SQLiteHistoryRepository**: SQLiteを使用したHistoryRepositoryの実装

#### Services
- **AIImageAnalyzer**: AI画像分析サービス

### Interfaces層（外部デバイス）

- **CameraDevice**: カメラデバイスとのインターフェース
- **ReceiptScanner**: レシートスキャナーとのインターフェース

### Presentation層（UI）

- **DashboardScreen**: ダッシュボード画面（冷蔵庫の中身一覧）
- **InputScreen**: 入力画面（3種類の入力方法）
- **HistoryScreen**: 履歴画面（増減履歴）

## データフロー例

### アイテム追加の流れ

```
1. ユーザーがInputScreenで食材情報を入力
   ↓
2. InputScreenがAddItemUseCaseを呼び出し
   ↓
3. AddItemUseCaseがFridgeItemエンティティを生成
   ↓
4. AddItemUseCaseがFridgeRepository.save()を呼び出し
   ↓
5. SQLiteFridgeRepositoryがSQLiteにデータを保存
```

### 画像分析の流れ

```
1. ユーザーがInputScreenでカメラボタンをタップ
   ↓
2. CameraDeviceが画像をキャプチャ
   ↓
3. InputScreenがAnalyzeImageUseCaseを呼び出し
   ↓
4. AnalyzeImageUseCaseがAIImageAnalyzerを呼び出し
   ↓
5. AIImageAnalyzerが外部AI APIと連携して分析結果を返す
   ↓
6. InputScreenに分析結果が表示され、ユーザーが補正可能
```

## 変更容易性

このアーキテクチャにより、以下の変更が容易です：

1. **データベースの変更**: SQLiteからFirebaseやRealmへの変更が容易
2. **UI変更**: React NativeからWebやネイティブアプリへの変更が容易
3. **AI APIの変更**: 異なるAI APIプロバイダーへの切り替えが容易
4. **カメラライブラリの変更**: 異なるカメラライブラリへの切り替えが容易

すべての変更は、対応するレイヤーの実装を変更するだけで済み、他のレイヤーに影響を与えません。
