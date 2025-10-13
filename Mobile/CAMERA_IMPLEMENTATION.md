# カメラ撮影機能の実装詳細

## 概要
このドキュメントでは、InputFromItemPhotoDesign.mdの設計に基づいて実装されたカメラ撮影機能の詳細を説明します。

## 実装されたコンポーネント

### 1. CameraDevice (`src/interfaces/camera/CameraDevice.ts`)
実際のカメラデバイスとのインターフェース層

#### 主な機能
- **権限確認**: `checkPermission()` - カメラ権限の状態を確認
- **権限要求**: `requestPermission()` - ユーザーにカメラ権限を要求
- **画像撮影**: `captureImage()` - 写真を撮影してパスを返す
- **設定画面**: `openSettings()` - OSの設定画面を開く

#### 使用ライブラリ
```typescript
import { Camera } from 'react-native-vision-camera';
```

### 2. InputCameraScreen (`src/presentation/screens/InputCameraScreen.tsx`)
カメラ撮影のUI画面

#### 画面状態
1. **初期状態**: 撮影ボタンが表示される
2. **カメラプレビュー**: 実際のカメラ映像と撮影ボタン
3. **画像プレビュー**: 撮影後の画像と再撮影ボタン
4. **解析中**: AI解析中のローディング表示
5. **結果編集**: 認識された食材リストの編集画面

#### Hooksの使用
```typescript
const { hasPermission, requestPermission } = useCameraPermission();
const device = useCameraDevice('back');
const camera = useRef<Camera>(null);
```

## アーキテクチャフロー

```
User Action (撮影ボタン)
    ↓
InputCameraScreen.handleOpenCamera()
    ↓
useCameraPermission (権限確認)
    ↓
Camera Preview表示
    ↓
User Action (シャッターボタン)
    ↓
camera.current.takePhoto()
    ↓
ImageTempStore.saveImage() (一時保存)
    ↓
AnalyzeImageUseCase.execute() (AI解析)
    ↓
結果表示・編集
    ↓
AddItemUseCase.execute() (保存)
    ↓
完了ダイアログ (連続入力確認)
```

## 権限ハンドリング

### Android
- カメラ権限は`AndroidManifest.xml`で宣言
- 実行時に`Camera.requestCameraPermission()`で要求
- 拒否された場合は設定画面への誘導

### iOS
- Info.plistに使用目的を記載（必須）
- 実行時に`Camera.requestCameraPermission()`で要求
- 拒否された場合は設定画面への誘導

## エラーハンドリング

### 1. カメラデバイスが見つからない
```typescript
if (!device) {
  // エラーメッセージを表示
  return <ErrorView message="カメラデバイスが見つかりません" />;
}
```

### 2. 権限が拒否された
```typescript
Alert.alert(
  'カメラ権限が必要です',
  'カメラを使用するには設定から権限を許可してください。',
  [
    { text: 'キャンセル', style: 'cancel' },
    { text: '設定を開く', onPress: () => Linking.openSettings() },
  ],
);
```

### 3. 撮影失敗
```typescript
try {
  const photo = await camera.current.takePhoto();
} catch (error) {
  Alert.alert('エラー', '撮影に失敗しました。');
}
```

## テスト

### モックの実装
`__mocks__/react-native-vision-camera.js`にモックを実装:

```javascript
export const useCameraDevice = jest.fn(() => ({
  id: 'mock-camera',
  position: 'back',
  hasFlash: true,
}));

export const useCameraPermission = jest.fn(() => ({
  hasPermission: true,
  requestPermission: jest.fn(async () => true),
}));
```

### テストの実行
```bash
npm test
```

## パフォーマンス最適化

### 1. カメラの初期化
- カメラは必要な時のみアクティブ化（`isActive={showCamera}`）
- 撮影完了後は自動的に非アクティブ化

### 2. 画像の一時保存
- 撮影した画像は一時ストレージに保存
- AI解析完了後に削除（プライバシー保護）

### 3. メモリ管理
- useRefを使用してカメラインスタンスを保持
- 不要な再レンダリングを防止

## 今後の改善点

### 1. 画像圧縮
- 撮影後に画像を圧縮してAI解析のコストを削減
- `react-native-image-resizer`などの導入を検討

### 2. バッチ撮影
- 複数枚の写真を連続で撮影できる機能
- バッチ解析による効率化

### 3. カメラ設定
- フラッシュのオン/オフ
- HDRモード
- 画質設定

### 4. アクセシビリティ
- 音声ガイダンス
- ボタンのラベル改善
- コントラストの調整

## トラブルシューティング

### カメラが起動しない
1. 権限が正しく設定されているか確認
2. デバイスの再起動
3. アプリの再ビルド（特にネイティブコード変更後）

### iOS: Podのエラー
```bash
cd ios
pod deintegrate
pod install
```

### Android: ビルドエラー
```bash
cd android
./gradlew clean
cd ..
npm run android
```

## 参考資料
- [react-native-vision-camera ドキュメント](https://react-native-vision-camera.com/)
- [InputFromItemPhotoDesign.md](../CopilotInstructions/InputFromItemPhotoDesign.md)
- [React Native カメラ権限ガイド](https://reactnative.dev/docs/permissionsandroid)
