# IntegratedMealPlanning

統合献立作成AIアプリ - React Native アプリケーション

## 概要

このアプリケーションは、冷蔵庫の中身をAIと手入力で管理し、ユーザーがダッシュボードで内容を把握し、履歴で増減を確認できるアプリです。
さらに、AIを使って冷蔵庫の中身から最大1ヶ月分の献立を自動作成できます。アレルゲン対応、予算管理、カロリー管理も可能で、詳細な調理手順や料理サイトへのリンクも提供します。

## 技術スタック

- **言語**: TypeScript
- **フレームワーク**: React Native
- **ローカルDB**: SQLite
- **アーキテクチャ**: Clean Architecture
- **設計思想**: DDD (Domain-Driven Design)

## ディレクトリ構造

```
src/
├── application/        # UseCase層
│   └── usecases/      # ビジネスロジック
├── domain/            # Entity, ValueObject, RepositoryInterfaceなど
│   ├── entities/      # ドメインエンティティ
│   ├── valueobjects/  # 値オブジェクト
│   └── repositories/  # リポジトリインターフェース
├── infrastructure/    # DB, 外部API実装
│   ├── database/      # SQLite実装
│   └── services/      # 外部サービス実装
├── interfaces/        # UIや外部デバイスとのIF
│   ├── camera/        # カメラインターフェース
│   └── scanner/       # スキャナーインターフェース
├── presentation/      # React Nativeコンポーネント（UI層）
│   ├── screens/       # 画面コンポーネント
│   └── components/    # 再利用可能なUIコンポーネント
└── utils/            # 共通ユーティリティ
```

## 主な機能

### 冷蔵庫管理
- 冷蔵庫の中身の登録（カメラ撮影、レシート撮影、手入力）
- 食材の入出庫管理
- 在庫の確認と履歴表示

### AI献立作成
- 冷蔵庫の中身から最大1ヶ月分の献立を自動生成
- アレルゲン対応（設定したアレルゲンを避けた献立）
- 予算管理（目安の予算金額を表示）
- カロリー管理（目安のカロリーを表示）
- 冷蔵庫の中身を優先的に使用し、足りない食材は購入前提で献立作成

### 献立詳細
- 料理名と必要な食材リスト
- 冷蔵庫にある食材と購入が必要な食材を区別して表示
- 詳細な調理手順（ステップバイステップ）
- 料理サイトへのリンク（オプション）

## 画面構成

1. **ダッシュボード画面** - 現在の冷蔵庫の中身と今日の献立を一覧表示
2. **入力画面** - 3種類の入力方法を提供
   - カメラ撮影 → AI画像分析 → 手入力補正 → 登録
   - レシート撮影 → AI画像分析 → 手入力補正 → 登録
   - 手入力 → 登録
3. **履歴画面** - 日々の冷蔵庫の中身の増減を表示
4. **献立作成画面** - 期間、アレルゲン、予算を設定してAI献立生成
5. **献立一覧画面** - 作成された献立を日付ごとに一覧表示
6. **献立詳細画面** - 料理の詳細、食材、調理手順、予算、カロリーを表示
7. **アレルゲン管理画面** - アレルゲンの登録・編集・削除

## セットアップ

### 前提条件

- Node.js >= 18
- React Native開発環境のセットアップ
  - iOS開発の場合: Xcode
  - Android開発の場合: Android Studio

### インストール

```bash
# 依存パッケージのインストール
npm install

# iOS用のPodsをインストール（macOSのみ）
cd ios && pod install && cd ..
```

### 実行

```bash
# Androidで実行
npm run android

# iOSで実行（macOSのみ）
npm run ios

# Metro bundlerを起動
npm start
```

## 開発

### リントとフォーマット

```bash
# ESLintでコードをチェック
npm run lint

# Prettierでコードをフォーマット
npx prettier --write .
```

### テスト

```bash
# テストを実行
npm test
```

## アーキテクチャ

このアプリケーションはClean Architectureを採用しており、以下のレイヤーに分離されています：

- **Presentation層**: React Nativeコンポーネント
- **Application層**: Use Cases（ビジネスロジック）
- **Domain層**: エンティティ、値オブジェクト、リポジトリインターフェース
- **Infrastructure層**: データベース実装、外部API実装

この構造により、以下の変更が容易になります：
- Web対応
- データベースの変更
- UIフレームワークの変更
- デバイス機能の変更
- 外部APIの変更

## ライセンス

MIT License