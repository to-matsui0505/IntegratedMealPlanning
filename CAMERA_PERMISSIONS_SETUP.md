# カメラ権限設定ガイド

## 概要
実機デバッグ時に「カメラ権限が必要です」というメッセージが表示される問題を解決するため、Android と iOS の両方でカメラ権限の宣言を追加しました。

## 問題

### 報告された問題
実機デバッグ時に「カメラ権限が必要です」というメッセージが表示されるだけで、カメラが起動しない。

### 原因
プラットフォーム固有の設定ファイルにカメラ権限の宣言が不足していました：
- **Android**: `AndroidManifest.xml` に `CAMERA` 権限が未宣言
- **iOS**: `Info.plist` に `NSCameraUsageDescription` が未設定

## 解決策

### Android の権限設定

#### 追加した権限
`android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
```

#### 説明
1. **`<uses-permission android:name="android.permission.CAMERA" />`**
   - アプリがカメラを使用することをシステムに宣言
   - Android 6.0 (API 23) 以降では、実行時に権限要求も必要

2. **`<uses-feature android:name="android.hardware.camera" android:required="false" />`**
   - カメラハードウェアの使用を宣言
   - `required="false"` により、カメラがないデバイスでもインストール可能
   - Google Playでのフィルタリングに使用

#### 実行時権限の処理
CameraDevice.tsで実装済み：

```typescript
async requestPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'カメラ権限の許可',
        message: 'この機能を使用するにはカメラへのアクセスが必要です。',
        buttonPositive: '許可',
        buttonNegative: '拒否',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}
```

### iOS の権限設定

#### 追加した権限
`ios/Mobile/Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>食材を撮影してAIで自動認識するため、カメラへのアクセスが必要です。</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>撮影した画像を保存するため、フォトライブラリへのアクセスが必要です。</string>
```

#### 説明
1. **`NSCameraUsageDescription`** (必須)
   - カメラへのアクセス理由をユーザーに説明
   - この設定がないとアプリがクラッシュする
   - iOS 10.0 以降で必須

2. **`NSPhotoLibraryUsageDescription`** (オプション)
   - 写真ライブラリへのアクセス理由を説明
   - 将来的に画像保存機能を追加する場合に備えて設定

#### 実行時権限の処理
iOSでは `launchCamera` を呼び出すと自動的に権限ダイアログが表示されます。

## 権限フロー

### Android
```
1. ユーザーが撮影ボタンをタップ
   ↓
2. CameraDevice.checkPermission() で権限確認
   ↓
3. 権限がない場合
   ↓
4. CameraDevice.requestPermission() で権限要求
   ↓
5. システムダイアログが表示
   - 「許可」を選択 → カメラ起動
   - 「拒否」を選択 → エラーメッセージ
```

### iOS
```
1. ユーザーが撮影ボタンをタップ
   ↓
2. launchCamera() を呼び出し
   ↓
3. 初回起動時のみシステムダイアログが表示
   - 「OK」を選択 → カメラ起動
   - 「許可しない」を選択 → エラーメッセージ
   ↓
4. 2回目以降は自動的にカメラ起動
```

## ビルド手順

### Android
権限を追加した後、アプリを再ビルドする必要があります：

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

または：

```bash
npm run android
```

### iOS
権限を追加した後、アプリを再ビルドする必要があります：

```bash
cd ios
pod install  # 依存関係の更新
cd ..
npx react-native run-ios
```

または：

```bash
npm run ios
```

## 権限の確認方法

### Android
1. アプリをインストール
2. 設定 → アプリ → Mobile → 権限 を開く
3. 「カメラ」権限が表示されていることを確認
4. 権限を許可/拒否できることを確認

### iOS
1. アプリをインストール
2. 設定 → プライバシーとセキュリティ → カメラ を開く
3. アプリが一覧に表示されていることを確認
4. トグルで権限を許可/拒否できることを確認

## トラブルシューティング

### Android で権限が表示されない
**原因**: アプリが再ビルドされていない

**解決策**:
```bash
# アプリをアンインストール
adb uninstall com.mobile

# クリーンビルド
cd android
./gradlew clean
cd ..
npm run android
```

### iOS でカメラが起動しない
**原因**: Info.plistの変更が反映されていない

**解決策**:
```bash
# Xcodeでプロジェクトをクリーン
# または
cd ios
rm -rf build/
pod install
cd ..
npm run ios
```

### 権限ダイアログが表示されない（2回目以降）
**原因**: ユーザーが既に権限を許可または拒否している

**解決策**:
- Android: 設定 → アプリ → Mobile → 権限 → カメラ → リセット
- iOS: 設定 → プライバシーとセキュリティ → カメラ → Mobile → オフ/オン

### 「カメラ権限が必要です」が表示され続ける
**原因**: ユーザーが権限を拒否し、「今後表示しない」を選択した

**解決策**:
設定から手動で権限を許可する必要があります。アプリ内で設定画面を開くコードを追加することも検討してください。

## セキュリティとプライバシー

### 権限の最小化
現在の実装では以下の権限のみを要求：
- カメラ（必須）
- フォトライブラリ（オプション、将来の機能用）

### ユーザーへの説明
権限要求時には明確な理由を提示：
- Android: ダイアログのメッセージ
- iOS: Info.plistの説明文

### ベストプラクティス
1. 必要な時点で権限を要求（初回起動時ではなく）
2. 権限が拒否された場合の代替フローを提供
3. ユーザーが権限を許可しやすい説明を提供

## 参考資料

### Android
- [Permissions on Android](https://developer.android.com/guide/topics/permissions/overview)
- [Camera permissions](https://developer.android.com/training/permissions/requesting#camera)

### iOS
- [Requesting Authorization for Media Capture](https://developer.apple.com/documentation/avfoundation/cameras_and_media_capture/requesting_authorization_for_media_capture_on_ios)
- [Info.plist Keys](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html)

### React Native
- [PermissionsAndroid](https://reactnative.dev/docs/permissionsandroid)
- [react-native-image-picker](https://github.com/react-native-image-picker/react-native-image-picker)

---

**更新日**: 2025年10月16日  
**対応コメント**: #3408964498
