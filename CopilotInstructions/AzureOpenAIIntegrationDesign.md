# Azure OpenAI統合設計

## 概要
食材撮影機能でAzure OpenAIを使用して画像から食材を認識し、自動的に食材情報を取得する機能の設計。

## 目的
- カメラで撮影した食材画像をAIで自動認識
- 手入力の手間を削減し、ユーザー体験を向上
- 高精度な食材認識により登録の正確性を向上

## Azure OpenAI設定

### 設定項目
以下の項目は「その他」タブの設定画面で設定可能：

1. **エンドポイント** (必須)
   - Azure OpenAIリソースのエンドポイントURL
   - 例: `https://your-resource.openai.azure.com`

2. **APIキー** (必須)
   - Azure OpenAIのアクセスキー
   - セキュアに保存され、画面上では非表示

3. **モデル名** (必須)
   - デプロイしたモデルの名前
   - 推奨: `gpt-4o` (Vision対応モデル)
   - 他の選択肢: `gpt-4-vision-preview`, `gpt-4-turbo`

4. **APIバージョン** (必須)
   - Azure OpenAI APIのバージョン
   - デフォルト: `2024-02-15-preview`

5. **タイムアウト時間** (必須)
   - AI解析のタイムアウト時間（秒）
   - デフォルト: 30秒
   - 推奨範囲: 30-60秒

### 設定の保存
- 設定はInMemoryConfigRepositoryに保存（将来的にAsyncStorageやSecureStoreに移行）
- アプリ起動時に設定を読み込み
- 設定変更は即座に反映

## 画像解析フロー

### 1. 画像の準備
```
ユーザーがカメラで撮影 or ギャラリーから選択
    ↓
画像URIを取得
    ↓
ImageManipulatorでBase64エンコード（JPEG形式）
```

### 2. Azure OpenAI SDKによるAPI連携
```
使用パッケージ: openai (公式Azure OpenAI SDK)
初期化: new AzureOpenAI({ endpoint, apiKey, apiVersion })
```

### 3. ChatCompletion API呼び出し
```typescript
const completion = await client.chat.completions.create({
  model: config.modelName,
  messages: [
    { role: 'system', content: '...' },
    { 
      role: 'user', 
      content: [
        { type: 'text', text: '...' },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64}` }}
      ]
    }
  ],
  max_completion_tokens: 16384,
});
```

### 4. レスポンス形式
```json
{
  "items": [
    {
      "category": "野菜類",
      "subCategory": "葉物野菜",
      "name": "レタス",
      "quantity": 1,
      "unit": "個",
      "confidence": 0.95
    }
  ]
}
```

### 5. 使用量とコスト計算
- APIレスポンスに含まれる `usage` オブジェクトからトークン使用量を取得
- 入力トークン料金: $0.01 / 1K tokens
- 出力トークン料金: $0.03 / 1K tokens
- 開発環境では自動的にコンソールにトークン数と推定課金額を表示
- 日本円換算も表示（1USD=150円として計算）

### 6. エラーハンドリング
- **設定未完了**: 「Azure OpenAI の設定が完了していません。「その他」タブから設定を行ってください。」
- **タイムアウト**: 「タイムアウトしました（{timeoutSeconds}秒）」
- **API エラー**: 「Azure OpenAI API エラー ({status}): {errorText}」
- **レスポンス形式エラー**: 「Azure OpenAI のレスポンス形式が正しくありません」
- **ネットワークエラー**: 「画像解析エラー: {error.message}」

## アーキテクチャ

### クラス構成

#### AzureOpenAIConfig (Entity)
```typescript
interface AzureOpenAIConfig {
  endpoint: string;
  apiKey: string;
  modelName: string;
  apiVersion: string;
  timeoutSeconds: number;
}
```

#### ConfigRepository (Repository Interface)
```typescript
interface ConfigRepository {
  getAzureOpenAIConfig(): Promise<AzureOpenAIConfig>;
  saveAzureOpenAIConfig(config: AzureOpenAIConfig): Promise<void>;
}
```

#### InMemoryConfigRepository (Repository Implementation)
- ConfigRepositoryの実装
- メモリ内に設定を保存
- 将来的にAsyncStorageやSecureStoreに置き換え可能

#### AzureOpenAIImageAnalyzer (External Service)
```typescript
class AzureOpenAIImageAnalyzer implements AIImageAnalyzer {
  constructor(private configRepository: ConfigRepository)
  async analyzeImage(imageUri: string): Promise<ImageAnalysisResult>
  private calculateCost(inputTokens: number, outputTokens: number): number
  private logDebugInfo(usage: any, cost: number): void
}
```

**使用技術・パッケージ:**
- `openai` (v4.77.1+): 公式Azure OpenAI SDK
- `expo-image-manipulator`: 画像のBase64エンコード（JPEG形式）
- `@azure/identity`: Azure認証（将来的な拡張用）

**主な機能:**
- Azure OpenAI SDKを使用したVision API呼び出し
- トークン使用量の取得とコスト計算
- 開発環境でのデバッグ情報出力（トークン数、課金額）

#### SettingsScreen (Presentation)
- Azure OpenAI設定の入力画面
- バリデーション機能
- 設定の保存・読み込み

### 依存関係
```
SettingsScreen
    ↓
ConfigRepository ← InMemoryConfigRepository

InputCameraScreen
    ↓
AnalyzeImageUseCase
    ↓
AIImageAnalyzer ← AzureOpenAIImageAnalyzer
                      ↓
                  ConfigRepository
```

## UI/UX

### 設定画面（その他タブ）
- タイトル: "Azure OpenAI 設定"
- 説明文: "食材撮影の画像解析にAzure OpenAIを使用します。以下の項目を設定してください。"
- 入力フォーム:
  - エンドポイント（テキストボックス）
  - APIキー（パスワード入力）
  - モデル名（テキストボックス）
  - APIバージョン（テキストボックス）
  - タイムアウト時間（数値入力）
- 保存ボタン
- 設定方法の説明セクション

### 解析中の表示
- 「画像を解析中...」メッセージ
- ローディングインジケーター（スピナー）
- キャンセル不可（タイムアウトまで待機）

### 解析結果
- 各アイテムに信頼度スコア（confidence）を表示
- 信頼度 < 0.6 の場合は警告色で表示
- ユーザーが編集・削除可能

## セキュリティ

### APIキーの保護
- 画面上では「●●●●●●」で表示（secureTextEntry）
- ネットワーク通信はHTTPS必須
- 将来的にSecureStoreやKeyChainでの暗号化保存を推奨

### データプライバシー
- 画像はBase64エンコードしてAPI送信
- レスポンス受信後、画像データはメモリから削除
- Azure OpenAIのデータ保持ポリシーに従う

## 将来の拡張性

### AIサービスの切り替え
- AIImageAnalyzerインターフェースを実装することで、他のAIサービスに切り替え可能
- 例: Google Vision API, AWS Rekognition, OpenAI API（非Azure）

### 設定の永続化
- AsyncStorageへの移行（セキュリティレベル低）
- SecureStoreへの移行（推奨、APIキーの暗号化）
- KeyChainへの移行（iOS）

### オフライン対応
- ローカルAIモデルの統合（TensorFlow Lite, Core ML）
- オンライン/オフラインの自動切り替え
- オフライン時の機能制限通知

## テスト方針

### 単体テスト
- AzureOpenAIImageAnalyzerのモックテスト
- ConfigRepositoryの保存・取得テスト
- SettingsScreenのバリデーションテスト

### 統合テスト
- 実際のAzure OpenAI APIを使用した画像解析テスト
- エラーハンドリングの確認
- タイムアウトの動作確認

### E2Eテスト
- 設定入力から画像解析までのフルフロー
- 設定変更後の動作確認
- 複数の食材画像での認識精度確認

## 運用上の注意点

### コスト管理
- Azure OpenAI APIは従量課金
- GPT-4 Vision料金（2024年時点）:
  - 入力: $0.01 / 1K tokens
  - 出力: $0.03 / 1K tokens
- 画像解析は1リクエストあたり約1000-2000トークン消費
- 開発環境では自動的にコンソールにトークン数と課金額を表示
- 頻繁な解析によるコスト増加に注意

### デバッグ情報
開発環境（`__DEV__`が`true`）では、各API呼び出し後に以下の情報をコンソールに出力:
```
=== Azure OpenAI API 使用量デバッグ情報 ===
入力トークン: 1234
出力トークン: 567
合計トークン: 1801
推定課金額: $0.029430 USD
推定課金額: ¥4.41 JPY (1USD=150円換算)
=========================================
```

### レート制限
- Azure OpenAIのレート制限に注意
- 連続解析時のリトライロジック実装を推奨

### モデルの選択
- Vision対応モデルが必須
- 最新のgpt-4oが推奨（精度と速度のバランス）
- モデルのデプロイメントはAzure Portal上で実施

## まとめ
この設計により、ユーザーは簡単な設定でAzure OpenAI SDKを利用した高精度な食材認識機能を使用できる。公式SDKの使用により、エラーハンドリングや認証が標準化され、メンテナンス性が向上している。また、開発時のデバッグ情報により、コスト管理とパフォーマンスの最適化が容易になっている。Clean Architectureの原則に従い、将来的な拡張や他のAIサービスへの切り替えも容易に行える柔軟な設計となっている。

### 主要な技術スタック
- **Azure OpenAI SDK** (`openai` v4.77.1+): 公式SDKによる標準化されたAPI連携
- **expo-image-manipulator**: 画像の前処理とBase64エンコード
- **TypeScript**: 型安全な実装
- **Clean Architecture**: レイヤー分離による保守性の確保
