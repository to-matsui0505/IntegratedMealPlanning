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
Base64エンコード
```

### 2. Azure OpenAI APIコール
```
エンドポイント: {endpoint}/openai/deployments/{modelName}/chat/completions?api-version={apiVersion}
メソッド: POST
ヘッダー:
  - Content-Type: application/json
  - api-key: {apiKey}
```

### 3. リクエストペイロード
```json
{
  "messages": [
    {
      "role": "system",
      "content": "あなたは食材認識のエキスパートです。画像から食材を認識し、JSON形式で返却してください..."
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "この画像に写っている食材を認識して、JSON形式で返却してください。"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,{base64Image}"
          }
        }
      ]
    }
  ],
  "max_tokens": 1000,
  "temperature": 0.7
}
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

### 5. エラーハンドリング
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
}
```

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
- 画像解析は1リクエストあたり約1000トークン消費
- 頻繁な解析によるコスト増加に注意

### レート制限
- Azure OpenAIのレート制限に注意
- 連続解析時のリトライロジック実装を推奨

### モデルの選択
- Vision対応モデルが必須
- 最新のgpt-4oが推奨（精度と速度のバランス）
- モデルのデプロイメントはAzure Portal上で実施

## まとめ
この設計により、ユーザーは簡単な設定でAzure OpenAIを利用した高精度な食材認識機能を使用できる。Clean Architectureの原則に従い、将来的な拡張や他のAIサービスへの切り替えも容易に行える柔軟な設計となっている。
