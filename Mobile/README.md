This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# IntegratedMealPlanning Mobile App

統合食事計画アプリのモバイル版。冷蔵庫の食材管理と献立計画をサポートします。

## 主な機能

### 📷 カメラ撮影による食材登録
- カメラで食材を撮影してAIで自動認識
- 認識結果の編集・確認
- SQLiteへの一括保存
- 詳細: [CAMERA_INPUT_FEATURE.md](./CAMERA_INPUT_FEATURE.md)
- 実装詳細: [CAMERA_IMPLEMENTATION.md](./CAMERA_IMPLEMENTATION.md)

### 📊 ダッシュボード
- 食材の在庫状況の可視化
- 賞味期限の管理
- 入出庫履歴の表示

### 🍳 献立計画
- AI による献立提案
- 食材を活用したレシピ提案

## ドキュメント
- [ナビゲーションフロー](./NAVIGATION_FLOW.md)
- [カメラ入力機能](./CAMERA_INPUT_FEATURE.md)
- [カメラ実装詳細](./CAMERA_IMPLEMENTATION.md)
- [Pickerコンポーネント](./PICKER_COMPONENT.md)

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Testing

## Run Tests

```sh
npm test
```

All tests should pass:
- CameraDevice.test.ts
- AnalyzeImageUseCase.test.ts
- ImageTempStore.test.ts
- App.test.tsx
- Picker.test.tsx

## Linting

```sh
npm run lint
```

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## Camera Issues

See [CAMERA_IMPLEMENTATION.md](./CAMERA_IMPLEMENTATION.md#トラブルシューティング) for camera-specific troubleshooting.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
