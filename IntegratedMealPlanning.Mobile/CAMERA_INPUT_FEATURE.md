# 食材撮影入力機能（入力方法①）

## 概要
このドキュメントは、カメラで食材を撮影してAI解析により冷蔵庫に登録する機能について説明します。

## 機能説明

### 入力方法選択画面
- 入力タブを開くと、以下の入力方法を選択できます：
  - ① カメラで撮影：食材をカメラで撮影してAI解析により登録
  - ③ 手入力：食材情報を手動で入力して登録
  - ② レシート撮影：（未実装）買い物レシートを撮影して登録

### カメラ撮影入力の流れ

1. **撮影/画像選択**
   - 「カメラで撮影」ボタンでカメラを起動し、食材を撮影
   - 「ギャラリーから選択」ボタンで既存の画像を選択

2. **AI解析**
   - 撮影/選択した画像を自動的にAI解析
   - 解析中は読み込みインジケーターを表示

3. **解析結果の確認・編集**
   - AIが検出した食材が一覧表示されます
   - 各アイテムは以下の情報を含みます：
     - 名称（必須）
     - 大分類
     - 小分類
     - 数量（必須）
     - 単位
   - 信頼度が低いアイテム（< 0.6）は警告色で表示
   - アイテムの追加・削除・編集が可能

4. **確定**
   - 「確定」ボタンで全アイテムをデータベースに保存
   - 保存後、連続入力の確認ダイアログが表示

5. **連続入力**
   - 「はい」を選択すると、続けて撮影可能
   - 「いいえ」を選択すると、入力方法選択画面に戻る

## アーキテクチャ

### 主要コンポーネント

#### CameraDevice (`src/interfaces/devices/CameraDevice.ts`)
- カメラ撮影とギャラリー選択のインターフェース
- `ExpoCameraDevice`クラスで`expo-camera`と`expo-image-picker`を使用した実装

#### InputCameraScreen (`src/presentation/screens/InputCameraScreen.tsx`)
- 撮影・解析・編集のUIを提供
- 解析結果の表示と編集機能
- 連続入力のサポート

#### AnalyzeImageUseCase (`src/application/use-cases/AnalyzeImageUseCase.ts`)
- 画像をAI解析するユースケース
- 現在は`MockAIImageAnalyzer`を使用（将来はAzure OpenAI連携予定）

#### AddItemUseCase (`src/application/use-cases/AddItemUseCase.ts`)
- 単一アイテムの追加（`execute`）
- 複数アイテムの一括追加（`executeBatch`）

### 依存性注入
- すべてのサービスは`DIContainer`で管理
- テスト時にモック実装への差し替えが容易

## 権限設定

### iOS
- `NSCameraUsageDescription`: カメラ使用の説明
- `NSPhotoLibraryUsageDescription`: フォトライブラリアクセスの説明

### Android
- `CAMERA`: カメラ権限
- `READ_MEDIA_IMAGES`: ギャラリーアクセス権限

## 今後の拡張

### Azure OpenAI連携
現在はモック実装を使用していますが、将来的に以下の対応が必要：
1. Azure OpenAI APIキーの安全な管理
2. 画像をBase64エンコードしてAPIに送信
3. レスポンスのパース処理
4. エラーハンドリングとリトライ処理

### レシート撮影機能
入力方法②として、買い物レシートを撮影して食材を一括登録する機能を追加予定。

## トラブルシューティング

### カメラが起動しない
- アプリにカメラ権限が付与されているか確認
- iOSの場合：設定 > プライバシー > カメラ
- Androidの場合：設定 > アプリ > 権限 > カメラ

### 画像解析が失敗する
- 現在はモック実装のため、常に同じ結果を返します
- 実際のAI連携時は、ネットワーク接続やAPIキーを確認

## 開発者向け情報

### テスト実行
```bash
cd IntegratedMealPlanning.Mobile
npm run lint
npx tsc --noEmit
```

### 開発サーバー起動
```bash
npm start
```

### ビルド
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```
