# IntegratedMealPlanning

冷蔵庫管理AIアプリ - React Native アプリケーション

## 概要

このアプリケーションは、冷蔵庫の中身をAIと手入力で管理し、ユーザーがダッシュボードで内容を把握し、履歴で増減を確認できるようにするアプリです。

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

## 画面構成

1. **ダッシュボード画面** - 現在の冷蔵庫の中身を一覧表示
2. **入力画面** - 3種類の入力方法を提供
   - カメラ撮影 → AI画像分析 → 手入力補正 → 登録
   - レシート撮影 → AI画像分析 → 手入力補正 → 登録
   - 手入力 → 登録
3. **履歴画面** - 日々の冷蔵庫の中身の増減を表示

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