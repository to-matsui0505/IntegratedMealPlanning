# 統合献立作成AIアプリ

## アプリ概要
- アプリ名：統合献立作成AIアプリ  
- ターゲットデバイス：Android / iPhone  
- 使用言語：TypeScript  
- フレームワーク：React Native  
- 設計思想：Clean Architecture、DDD準拠のディレクトリ構造  
- ローカルDB：SQLite  

## 目的
冷蔵庫の中身をAIと手入力で管理し、ユーザーがダッシュボードで内容を把握し、履歴で増減を確認できるようにする。
さらに、冷蔵庫の中身からAIを使って献立を自動作成し、最大1ヶ月分の食事計画を立てることができる。
アレルゲン対応、予算管理、カロリー管理も可能で、詳細な調理手順や料理サイトへのリンクも提供する。  

## 画面構成
1. **ダッシュボード画面**  
   - 現在の冷蔵庫の中身を一覧表示  
   - 今日の献立表示（あれば）

2. **入力画面**（3種類の入力方法を提供）  
   - 方法①：冷蔵庫の中身をカメラ撮影 → AI画像分析 → 手入力補正 → 登録  
   - 方法②：買い物レシートをカメラ撮影 → AI画像分析 → 手入力補正 → 登録  
   - 方法③：手入力 → 登録  
   - 入出庫操作により、冷蔵庫の中身を「増やす / 減らす」ことが可能（家計簿の収入・支出に相当）  

3. **履歴画面**  
   - 日々の冷蔵庫の中身の増減を表示

4. **献立作成画面**  
   - 期間選択（1日〜1ヶ月）
   - アレルゲン設定
   - 予算上限設定（オプション）
   - AI献立自動生成ボタン

5. **献立一覧画面**  
   - 作成された献立を日付ごとに一覧表示
   - 各献立の予算とカロリー表示
   - 献立詳細への遷移

6. **献立詳細画面**  
   - 料理名と写真（AI生成または既定画像）
   - 必要な食材リスト（冷蔵庫にあるもの／買う必要があるもの）
   - 詳細な作り方（ステップバイステップ）
   - 予算とカロリー情報
   - 料理サイトへのリンク（オプション）

7. **アレルゲン管理画面**  
   - アレルゲン登録・編集・削除
   - よくあるアレルゲンのプリセット選択  

## 入力データ仕様

### 冷蔵庫アイテム
- **入出庫**（入庫 or 出庫）  
- **大分類**（例：肉類、野菜類、乳製品、飲料、調味料、酒類など）  
- **小分類**（例：ハム、ベーコン、牛肉、豚肉、鶏肉など）  
- **名称**（例：部位、一般名称。加工食品は製品名も可）  
- **数量**  
- **単位**  
- **更新日**（入出庫日）

### 献立データ
- **献立ID**
- **日付**
- **食事タイプ**（朝食、昼食、夕食）
- **料理名**
- **必要食材リスト**（冷蔵庫から／購入必要）
- **調理手順**（テキスト）
- **予算**（AIによる目安金額）
- **カロリー**（AIによる目安値）
- **料理サイトURL**（オプション）
- **アレルゲン情報**

### アレルゲンデータ
- **アレルゲンID**
- **アレルゲン名**（例：卵、乳製品、小麦、そば、落花生、えび、かになど）
- **有効/無効フラグ**  

## アーキテクチャ設計方針
- **Clean Architecture** を採用し、以下のような変更容易性を確保する
  - Web  
  - DB  
  - UI  
  - Devices（カメラ、スマホ機能など）  
  - External Interfaces（AI画像認識APIなど）  

## ディレクトリ戦略（DDD準拠）
```
src/
├── application/ # UseCase層
├── domain/ # Entity, ValueObject, RepositoryInterfaceなど
├── infrastructure/ # DB, 外部API実装
├── interfaces/ # UIや外部デバイスとのIF
├── presentation/ # React Nativeコンポーネント（UI層）
└── utils/ # 共通ユーティリティ
```

---

## クラス図（Mermaid）

```mermaid
classDiagram
    class FridgeItem {
      +string id
      +enum type (入庫/出庫)
      +string category
      +string subCategory
      +string name
      +number quantity
      +string unit
      +Date updatedAt
    }

    class HistoryRecord {
      +string id
      +string fridgeItemId
      +enum changeType (増加/減少)
      +number changeAmount
      +Date date
    }

    class MealPlan {
      +string id
      +Date date
      +enum mealType (朝食/昼食/夕食)
      +string dishName
      +Ingredient[] ingredients
      +string[] cookingSteps
      +number estimatedBudget
      +number estimatedCalories
      +string recipeUrl
      +string[] allergens
    }

    class Ingredient {
      +string name
      +number quantity
      +string unit
      +boolean inFridge
    }

    class Allergen {
      +string id
      +string name
      +boolean enabled
    }

    class FridgeRepository {
      +save(item: FridgeItem) Promise<void>
      +findAll() Promise<FridgeItem[]>
      +findById(id: string) Promise<FridgeItem | null>
      +delete(id: string) Promise<void>
    }

    class MealPlanRepository {
      +save(plan: MealPlan) Promise<void>
      +findAll() Promise<MealPlan[]>
      +findByDateRange(start: Date, end: Date) Promise<MealPlan[]>
      +delete(id: string) Promise<void>
    }

    class AllergenRepository {
      +save(allergen: Allergen) Promise<void>
      +findAll() Promise<Allergen[]>
      +findEnabled() Promise<Allergen[]>
      +delete(id: string) Promise<void>
    }

    class AddItemUseCase
    class RemoveItemUseCase
    class GetCurrentItemsUseCase
    class GetHistoryUseCase
    class AnalyzeImageUseCase
    class GenerateMealPlanUseCase
    class GetMealPlansUseCase
    class GetMealPlanDetailUseCase
    class ManageAllergensUseCase

    class AIMealPlanGenerator
    class AIImageAnalyzer
    class CameraDevice
    class ReceiptScanner

    class DashboardScreen
    class InputScreen
    class HistoryScreen
    class MealPlanCreateScreen
    class MealPlanListScreen
    class MealPlanDetailScreen
    class AllergenManagementScreen

    MealPlan --> Ingredient
    FridgeRepository --> FridgeItem
    MealPlanRepository --> MealPlan
    AllergenRepository --> Allergen
    HistoryRecord --> FridgeItem
    AddItemUseCase --> FridgeRepository
    RemoveItemUseCase --> FridgeRepository
    GetCurrentItemsUseCase --> FridgeRepository
    GetHistoryUseCase --> HistoryRecord
    AnalyzeImageUseCase --> AIImageAnalyzer
    GenerateMealPlanUseCase --> AIMealPlanGenerator
    GenerateMealPlanUseCase --> FridgeRepository
    GenerateMealPlanUseCase --> AllergenRepository
    GenerateMealPlanUseCase --> MealPlanRepository
    GetMealPlansUseCase --> MealPlanRepository
    GetMealPlanDetailUseCase --> MealPlanRepository
    ManageAllergensUseCase --> AllergenRepository
    AIImageAnalyzer --> CameraDevice
    AIImageAnalyzer --> ReceiptScanner
    DashboardScreen --> GetCurrentItemsUseCase
    InputScreen --> AddItemUseCase
    InputScreen --> AnalyzeImageUseCase
    HistoryScreen --> GetHistoryUseCase
    MealPlanCreateScreen --> GenerateMealPlanUseCase
    MealPlanListScreen --> GetMealPlansUseCase
    MealPlanDetailScreen --> GetMealPlanDetailUseCase
    AllergenManagementScreen --> ManageAllergensUseCase
```

## ユースケース図（Mermaid）

```plantuml
    actor User
    actor AI as "AI画像解析サービス"
    actor MealPlanAI as "AI献立生成サービス"
    actor Camera as "カメラデバイス"

    User --> (冷蔵庫の中身を確認する)
    User --> (食材を登録する)
    User --> (食材を消費する)
    User --> (履歴を確認する)
    User --> (献立を作成する)
    User --> (献立を確認する)
    User --> (アレルゲンを管理する)

    (食材を登録する) --> (カメラ撮影して登録)
    (食材を登録する) --> (レシート撮影して登録)
    (食材を登録する) --> (手入力して登録)

    (献立を作成する) --> (期間を選択)
    (献立を作成する) --> (アレルゲンを設定)
    (献立を作成する) --> (予算を設定)
    (献立を作成する) --> (AI自動生成)

    (献立を確認する) --> (献立一覧を表示)
    (献立を確認する) --> (献立詳細を表示)
    (献立詳細を表示) --> (調理手順を表示)
    (献立詳細を表示) --> (料理サイトへ遷移)

    (カメラ撮影して登録) --> Camera
    (レシート撮影して登録) --> Camera
    (カメラ撮影して登録) --> AI
    (レシート撮影して登録) --> AI
    (AI自動生成) --> MealPlanAI
```
