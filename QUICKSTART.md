# 統合献立作成AIアプリ - クイックスタートガイド

このガイドでは、統合献立作成AIアプリの開発を始めるための手順を説明します。

## 前提条件

以下のツールがインストールされていることを確認してください：

- Node.js (v18以上推奨)
- npm または yarn
- Expo CLI
- iOS Simulator (macOS) または Android Emulator

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/to-matsui0505/IntegratedMealPlanning.git
cd IntegratedMealPlanning/IntegratedMealPlanning.Mobile
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm start
```

このコマンドを実行すると、Expo Dev Toolsが起動します。

### 4. アプリの実行

以下のいずれかの方法でアプリを実行できます：

#### iOS Simulator (macOS のみ)
```bash
npm run ios
```

#### Android Emulator
```bash
npm run android
```

#### Webブラウザ
```bash
npm run web
```

## プロジェクト構造の理解

```
IntegratedMealPlanning.Mobile/
├── src/                          # ソースコード
│   ├── domain/                   # ドメイン層
│   │   ├── entities/            # ビジネスエンティティ
│   │   └── repositories/        # リポジトリインターフェース
│   ├── application/             # アプリケーション層
│   │   └── use-cases/          # ユースケース（ビジネスロジック）
│   ├── infrastructure/          # インフラストラクチャ層
│   │   ├── di/                 # 依存性注入
│   │   ├── repositories/       # リポジトリ実装
│   │   └── external-services/  # 外部サービス
│   └── presentation/            # プレゼンテーション層
│       └── screens/            # React Nativeスクリーン
├── app/                         # Expo Router ファイル
│   └── (tabs)/                 # タブナビゲーション
└── components/                  # 共通コンポーネント
```

## 開発の流れ

### 新機能を追加する場合

1. **ドメイン層**: エンティティやリポジトリインターフェースを定義
2. **アプリケーション層**: ユースケースを実装
3. **インフラ層**: リポジトリや外部サービスを実装
4. **プレゼンテーション層**: UI画面を実装
5. **DIコンテナ**: 新しいユースケースを登録

### 例: 新しい画面を追加する

1. `src/presentation/screens/` に新しいスクリーンを作成
2. 必要なユースケースを `DIContainer` から取得
3. `app/(tabs)/` にタブを追加（必要に応じて）

```typescript
// 新しいスクリーンの例
import { diContainer } from '@/src/infrastructure/di/DIContainer';

export default function NewScreen() {
  const useCase = diContainer.getYourUseCase();
  // ... 画面のロジック
}
```

## 主要なコマンド

### 開発
```bash
npm start          # 開発サーバーを起動
npm run ios        # iOSシミュレータで実行
npm run android    # Androidエミュレータで実行
npm run web        # Webブラウザで実行
```

### コード品質
```bash
npm run lint       # ESLintでコードをチェック
```

### その他
```bash
npm run reset-project  # プロジェクトをリセット
```

## Clean Architectureの原則

このプロジェクトは Clean Architecture に従っています：

1. **依存関係の方向**: 外側の層は内側の層に依存します
   ```
   Presentation → Application → Domain
   Infrastructure → Domain
   ```

2. **依存性注入**: `DIContainer` を使用して依存関係を管理

3. **レイヤーの責務**:
   - **Domain**: ビジネスロジックとルール
   - **Application**: ユースケースの実装
   - **Infrastructure**: 技術的な実装詳細
   - **Presentation**: UIとユーザーインタラクション

## よくある質問

### Q: データはどこに保存されますか？
A: 現在はインメモリ実装なので、アプリを再起動するとデータが消えます。将来的にSQLiteを統合予定です。

### Q: AI機能は動作しますか？
A: 現在はモック実装です。実際のAI APIへの統合は今後の実装予定です。

### Q: 新しいユースケースを追加するには？
A: 以下の手順で追加できます：
1. `src/application/use-cases/` に新しいユースケースを作成
2. `src/infrastructure/di/DIContainer.ts` にメソッドを追加
3. プレゼンテーション層から `diContainer.getYourUseCase()` で使用

### Q: テストはどこにありますか？
A: テストはまだ実装されていません。今後の実装予定です。

## トラブルシューティング

### Expo が見つからない
```bash
npm install -g expo-cli
```

### モジュールが見つからないエラー
```bash
# node_modules を削除して再インストール
rm -rf node_modules
npm install
```

### iOS ビルドエラー
```bash
cd ios
pod install
cd ..
```

## 次のステップ

1. `src/README.md` で技術的な詳細を確認
2. `IMPLEMENTATION_SUMMARY.md` で実装の概要を確認
3. `CopilotInstructions/ApplicationBasicDesign.md` で設計書を確認

## サポート

問題が発生した場合は、以下を確認してください：

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- プロジェクトの README.md

## ライセンス

このプロジェクトのライセンスについては、リポジトリのルートにある LICENSE ファイルを参照してください。
