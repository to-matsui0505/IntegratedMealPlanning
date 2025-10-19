# ダッシュボード機能クイックスタートガイド

## 📋 概要

このガイドでは、実装されたダッシュボード機能の構造と動作を理解するための情報を提供します。

## 🏗️ アーキテクチャ構造

```
ダッシュボード機能
│
├─ Domain Layer（ドメイン層）
│  ├─ entities/
│  │  ├─ Activity.ts          # アクティビティエンティティ
│  │  └─ Summary.ts           # サマリーエンティティ
│  └─ repositories/
│     └─ ActivityRepository.ts # アクティビティリポジトリIF
│
├─ Application Layer（アプリケーション層）
│  └─ use-cases/
│     ├─ GetDashboardSummaryUseCase.ts    # サマリー取得
│     └─ GetRecentActivitiesUseCase.ts    # アクティビティ取得
│
├─ Infrastructure Layer（インフラ層）
│  └─ repositories/
│     └─ InMemoryActivityRepository.ts    # アクティビティ実装
│
└─ Presentation Layer（プレゼンテーション層）
   ├─ screens/
   │  └─ DashboardScreen.tsx              # メイン画面
   └─ components/
      ├─ SummaryCard.tsx                  # サマリーカード
      ├─ CategoryChart.tsx                # カテゴリ別チャート
      ├─ RecentActivityList.tsx           # アクティビティリスト
      └─ FloatingActionButtons.tsx        # フローティングボタン
```

## 🔄 データフロー

```
1. DashboardScreen（画面）
   ↓
2. DIContainer（依存性注入）
   ↓
3. UseCases（ユースケース）
   ├─ GetDashboardSummaryUseCase
   ├─ GetRecentActivitiesUseCase
   └─ GetCurrentItemsUseCase
   ↓
4. Repositories（リポジトリ）
   ├─ FridgeRepository → InMemoryFridgeRepository
   └─ ActivityRepository → InMemoryActivityRepository
   ↓
5. データ取得・加工
   ↓
6. State更新（useState）
   ├─ items: FridgeItem[]
   ├─ summaries: Summary[]
   └─ activities: Activity[]
   ↓
7. UIコンポーネントへ渡す
   ├─ SummaryCard
   ├─ CategoryChart
   ├─ RecentActivityList
   └─ 在庫リスト
```

## 📦 主要コンポーネント

### 1. SummaryCard
**役割**: 全体統計の表示
- 入力: `totalItems: number`, `totalCategories: number`
- 出力: サマリーカードUI

### 2. CategoryChart
**役割**: カテゴリ別在庫の視覚化
- 入力: `summaries: Summary[]`
- 出力: カラフルなカテゴリリスト
- 特徴: 6色のカラーパレット、パーセンテージ表示

### 3. RecentActivityList
**役割**: 最近のアクティビティ表示
- 入力: `activities: Activity[]`
- 出力: タイムライン形式のリスト
- 特徴: アイコン付き、時刻表示

### 4. FloatingActionButtons
**役割**: 主要操作へのクイックアクセス
- 入力: `onAddItem: () => void`, `onCreateMealPlan: () => void`
- 出力: 2つのフローティングボタン
- 特徴: 右下固定、シャドウ付き

## 🎯 ユースケース詳細

### GetDashboardSummaryUseCase
```typescript
// 使用例
const useCase = diContainer.getGetDashboardSummaryUseCase();
const summaries = await useCase.execute();
// 戻り値: Summary[] 
// [{ category: '野菜類', itemCount: 3, totalQty: 6 }, ...]
```

### GetRecentActivitiesUseCase
```typescript
// 使用例
const useCase = diContainer.getGetRecentActivitiesUseCase();
const activities = await useCase.execute(10); // 最新10件
// 戻り値: Activity[]
// [{ id, type, itemName, qty, timestamp, ... }, ...]
```

## 🔌 DIContainer統合

```typescript
// DIContainerでの登録
class DIContainer {
  private activityRepository: ActivityRepository;
  
  constructor() {
    this.activityRepository = new InMemoryActivityRepository();
  }
  
  getGetDashboardSummaryUseCase(): GetDashboardSummaryUseCase {
    return new GetDashboardSummaryUseCase(this.fridgeRepository);
  }
  
  getGetRecentActivitiesUseCase(): GetRecentActivitiesUseCase {
    return new GetRecentActivitiesUseCase(this.activityRepository);
  }
}
```

## 🎨 スタイリング

### テーマカラー
- プライマリボタン: `#007AFF`（青）
- セカンダリボタン: `#34C759`（緑）
- ボーダー: `#ddd`（ライトグレー）
- 背景: `#f8f9fa`（オフホワイト）

### サイズ
- ボタン高さ: 48px
- カード角丸: 8px
- アイコンサイズ: 20-24px
- フォントサイズ: 12-32px

## 🧪 テスト方法

### 1. ビジュアルテスト
```bash
cd IntegratedMealPlanning.Mobile
npm start
# Expoアプリでプレビュー
```

### 2. データ確認
- サンプルデータが正しく読み込まれているか
- 8品目の冷蔵庫アイテム
- 8件のアクティビティ

### 3. ナビゲーションテスト
- 食材追加ボタン → /input へ遷移
- 献立作成ボタン → /mealplan へ遷移

### 4. UIテスト
- スクロールが正常に動作
- フローティングボタンが常に表示
- カテゴリチャートが正しく色分け
- アクティビティが新しい順に表示

## 🔧 カスタマイズポイント

### 色の変更
`CategoryChart.tsx`の`colors`配列を編集:
```typescript
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', ...];
```

### アクティビティ表示件数の変更
`DashboardScreen.tsx`の`loadDashboardData`関数:
```typescript
const recentActivities = await activitiesUseCase.execute(20); // 10から20へ
```

### フローティングボタンの位置
`FloatingActionButtons.tsx`のスタイル:
```typescript
container: {
  position: 'absolute',
  right: 16,  // 右からの距離
  bottom: 16, // 下からの距離
}
```

## 📝 実装チェックリスト

- [x] Activityエンティティ作成
- [x] Summaryエンティティ作成
- [x] ActivityRepositoryインターフェース作成
- [x] InMemoryActivityRepository実装
- [x] GetDashboardSummaryUseCase実装
- [x] GetRecentActivitiesUseCase実装
- [x] SummaryCardコンポーネント作成
- [x] CategoryChartコンポーネント作成
- [x] RecentActivityListコンポーネント作成
- [x] FloatingActionButtonsコンポーネント作成
- [x] DashboardScreen拡張
- [x] DIContainer更新
- [x] サンプルデータ追加
- [x] Lint/TypeScriptエラーゼロ
- [x] ドキュメント作成

## 🚀 次のステップ

1. **実行して確認**
   ```bash
   cd IntegratedMealPlanning.Mobile
   npm start
   ```

2. **実際のデバイスでテスト**
   - Expo Goアプリをインストール
   - QRコードをスキャン

3. **UI/UX改善**
   - ユーザーフィードバックの収集
   - アニメーション追加
   - レスポンシブ調整

4. **機能拡張**
   - フィルタリング機能
   - ソート機能
   - 検索機能
   - データ永続化（SQLite）

## 📚 参考資料

- DashboardDesign.md - ダッシュボード設計書
- ApplicationBasicDesign.md - 全体設計書
- DASHBOARD_IMPLEMENTATION_REPORT.md - 実装レポート
- DASHBOARD_LAYOUT.md - レイアウト図

## ❓ トラブルシューティング

### データが表示されない
→ InMemoryRepositoryのサンプルデータが正しく初期化されているか確認

### ナビゲーションが動作しない
→ expo-routerが正しくインストールされているか確認

### スタイルが崩れる
→ ThemedViewとThemedTextコンポーネントが正しくインポートされているか確認

### TypeScriptエラー
→ `npx tsc --noEmit`でエラー箇所を特定
