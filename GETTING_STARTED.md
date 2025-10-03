# 開発を始めるには

このガイドでは、プロジェクトのセットアップから開発を始めるまでの手順を説明します。

## 前提条件

### 必須
- Node.js (v18以上)
- npm または yarn
- Git

### プラットフォーム別の要件

#### iOS開発の場合（macOSのみ）
- Xcode (最新版推奨)
- CocoaPods (`sudo gem install cocoapods`)

#### Android開発の場合
- Android Studio
- Android SDK
- JDK 11以上

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/to-matsui0505/IntegratedMealPlanning.git
cd IntegratedMealPlanning
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. iOS用のセットアップ（macOSのみ）

```bash
cd ios
pod install
cd ..
```

## 開発サーバーの起動

### Metro Bundlerの起動

```bash
npm start
```

### アプリの実行

別のターミナルウィンドウで：

```bash
# Androidで実行
npm run android

# iOSで実行（macOSのみ）
npm run ios
```

## プロジェクト構造の理解

### 主要なディレクトリ

```
src/
├── application/      # ビジネスロジック（ユースケース）
├── domain/          # コアドメインモデル
├── infrastructure/  # 外部システムとの連携
├── interfaces/      # デバイスインターフェース
├── presentation/    # UI層
└── utils/          # ユーティリティ
```

詳細は [ARCHITECTURE.md](./ARCHITECTURE.md) を参照してください。

## 開発フロー

### 1. 新機能の追加

1. **Domain層**: 必要なエンティティや値オブジェクトを定義
2. **Application層**: ユースケースを実装
3. **Infrastructure層**: 必要な永続化や外部連携を実装
4. **Presentation層**: UIを実装

### 2. コードスタイルの確認

```bash
# リントチェック
npm run lint

# フォーマット
npx prettier --write .
```

### 3. テストの実行

```bash
npm test
```

## よくある問題と解決方法

### iOS: `command not found: pod`

CocoaPodsがインストールされていない場合：

```bash
sudo gem install cocoapods
```

### Android: ビルドエラー

Android Studioで以下を確認：
1. SDKが正しくインストールされているか
2. 環境変数 `ANDROID_HOME` が設定されているか
3. エミュレータまたは実機が接続されているか

### Metro Bundler: キャッシュのクリア

```bash
npm start -- --reset-cache
```

## 次のステップ

### 実装が必要な機能

現在、以下の機能はスケルトンのみで、実装が必要です：

1. **SQLiteデータベース接続**
   - `src/infrastructure/database/` のリポジトリ実装
   - テーブル作成、CRUD操作

2. **AI画像分析API連携**
   - `src/infrastructure/services/AIImageAnalyzer.ts`
   - 外部APIとの連携実装

3. **カメラ機能**
   - `src/interfaces/camera/CameraDevice.ts`
   - React Nativeのカメラライブラリ統合

4. **レシートスキャン機能**
   - `src/interfaces/scanner/ReceiptScanner.ts`
   - OCR機能の実装

### 推奨される開発順序

1. SQLiteデータベースの実装
2. 基本的なCRUD操作の完成
3. UI/UXの改善
4. カメラ機能の実装
5. AI画像分析の統合
6. レシートスキャン機能の実装

## 参考資料

- [React Native公式ドキュメント](https://reactnative.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/)
- [Clean Architectureについて](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Designについて](https://martinfowler.com/tags/domain%20driven%20design.html)

## サポート

問題が発生した場合は、GitHubのIssuesに報告してください。
