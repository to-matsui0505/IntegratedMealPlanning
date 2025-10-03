# 統合献立作成AIアプリ

## アプリ概要
- アプリ名（仮）：冷蔵庫管理AIアプリ  
- ターゲットデバイス：Android / iPhone  
- 使用言語：TypeScript  
- フレームワーク：React Native  
- 設計思想：Clean Architecture、DDD準拠のディレクトリ構造  
- ローカルDB：SQLite  

## 目的
冷蔵庫の中身をAIと手入力で管理し、ユーザーがダッシュボードで内容を把握し、履歴で増減を確認できるようにする。  

## 画面構成
1. **ダッシュボード画面**  
   - 現在の冷蔵庫の中身を一覧表示  

2. **入力画面**（3種類の入力方法を提供）  
   - 方法①：冷蔵庫の中身をカメラ撮影 → AI画像分析 → 手入力補正 → 登録  
   - 方法②：買い物レシートをカメラ撮影 → AI画像分析 → 手入力補正 → 登録  
   - 方法③：手入力 → 登録  
   - 入出庫操作により、冷蔵庫の中身を「増やす / 減らす」ことが可能（家計簿の収入・支出に相当）  

3. **履歴画面**  
   - 日々の冷蔵庫の中身の増減を表示  

## 入力データ仕様
- **入出庫**（入庫 or 出庫）  
- **大分類**（例：肉類、野菜類、乳製品、飲料、調味料、酒類など）  
- **小分類**（例：ハム、ベーコン、牛肉、豚肉、鶏肉など）  
- **名称**（例：部位、一般名称。加工食品は製品名も可）  
- **数量**  
- **単位**  
- **更新日**（入出庫日）  

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

    class FridgeRepository {
      +save(item: FridgeItem) Promise<void>
      +findAll() Promise<FridgeItem[]>
      +findById(id: string) Promise<FridgeItem | null>
      +delete(id: string) Promise<void>
    }

    class AddItemUseCase
    class RemoveItemUseCase
    class GetCurrentItemsUseCase
    class GetHistoryUseCase
    class AnalyzeImageUseCase

    class AIImageAnalyzer
    class CameraDevice
    class ReceiptScanner

    class DashboardScreen
    class InputScreen
    class HistoryScreen

    FridgeRepository --> FridgeItem
    HistoryRecord --> FridgeItem
    AddItemUseCase --> FridgeRepository
    RemoveItemUseCase --> FridgeRepository
    GetCurrentItemsUseCase --> FridgeRepository
    GetHistoryUseCase --> HistoryRecord
    AnalyzeImageUseCase --> AIImageAnalyzer
    AIImageAnalyzer --> CameraDevice
    AIImageAnalyzer --> ReceiptScanner
    DashboardScreen --> GetCurrentItemsUseCase
    InputScreen --> AddItemUseCase
    InputScreen --> AnalyzeImageUseCase
    HistoryScreen --> GetHistoryUseCase
```

## ユースケース図（Mermaid）

```plantuml
    actor User
    actor AI as "AI画像解析サービス"
    actor Camera as "カメラデバイス"

    User --> (冷蔵庫の中身を確認する)
    User --> (食材を登録する)
    User --> (食材を消費する)
    User --> (履歴を確認する)

    (食材を登録する) --> (カメラ撮影して登録)
    (食材を登録する) --> (レシート撮影して登録)
    (食材を登録する) --> (手入力して登録)

    (カメラ撮影して登録) --> Camera
    (レシート撮影して登録) --> Camera
    (カメラ撮影して登録) --> AI
    (レシート撮影して登録) --> AI
```
