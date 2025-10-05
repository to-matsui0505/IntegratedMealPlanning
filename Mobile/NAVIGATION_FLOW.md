# ナビゲーションフロー実装

## 概要
ダッシュボードから食材撮影機能へのスムーズな導線を実装しました。シンプルな状態ベースのナビゲーションを使用し、外部ライブラリに依存しない軽量な実装となっています。

## 画面遷移フロー

```
┌─────────────────────────┐
│  DashboardScreen        │
│  ダッシュボード画面      │
│                         │
│  - 在庫サマリー表示     │
│  - 円グラフ表示         │
│  - アクティビティ表示   │
│  - [+ 食材追加] FAB     │ ←── 保存完了後に戻る
└─────────┬───────────────┘
          │ FABボタンタップ
          ↓
┌─────────────────────────┐
│  InputScreen            │
│  入力方法選択画面        │
│                         │
│  - 方法① カメラ撮影    │ ←── 選択可能
│  - 方法② レシート撮影  │
│  - 方法③ 手入力        │
│  - [← 戻る] ボタン      │
└─────────┬───────────────┘
          │ 「方法① カメラ撮影」選択
          ↓
┌─────────────────────────┐
│  InputCameraScreen      │
│  カメラ撮影画面          │
│                         │
│  1. 撮影                │
│  2. AI解析              │
│  3. 結果編集            │
│  4. 保存                │
│  - [✕ 戻る] ボタン      │
└─────────────────────────┘
```

## 実装の詳細

### App.tsx
シンプルな状態管理によるナビゲーション:
```typescript
const [currentScreen, setCurrentScreen] = useState<Screen>('Dashboard');

const renderScreen = () => {
  switch (currentScreen) {
    case 'Dashboard':
      return <DashboardScreen onNavigateToInput={() => navigateTo('Input')} />;
    case 'Input':
      return <InputScreen onNavigateBack={() => navigateTo('Dashboard')} />;
  }
};
```

### DashboardScreen.tsx
FABボタンに遷移機能を追加:
```typescript
interface DashboardScreenProps {
  onNavigateToInput?: () => void;
}

<TouchableOpacity style={styles.fabPrimary} onPress={onNavigateToInput}>
  <Text style={styles.fabText}>+ 食材追加</Text>
</TouchableOpacity>
```

### InputScreen.tsx
戻るボタンとナビゲーションハンドラを追加:
```typescript
interface InputScreenProps {
  onNavigateBack?: () => void;
}

<TouchableOpacity onPress={onNavigateBack} style={styles.backButton}>
  <Text style={styles.backButtonText}>← 戻る</Text>
</TouchableOpacity>
```

保存完了後にダッシュボードに戻る:
```typescript
const handleComplete = () => {
  setShowCameraInput(false);
  if (onNavigateBack) {
    onNavigateBack();
  }
};
```

## ユーザー体験

### 1. ダッシュボードから開始
- ユーザーはダッシュボード画面で「+ 食材追加」FABボタンを確認
- ボタンタップで入力方法選択画面へスムーズに遷移

### 2. 入力方法選択
- 3つの入力方法が表示される
- 「方法① カメラ撮影」を選択してカメラ撮影画面へ
- 戻るボタンでいつでもダッシュボードに戻れる

### 3. カメラ撮影から保存
- カメラで食材を撮影
- AI解析結果を確認・編集
- 保存完了後、自動的にダッシュボードに戻る

### 4. 連続入力
- 保存後に「続けて入力しますか？」のダイアログが表示
- 「続けて入力」を選択すると再度撮影画面へ
- 「ダッシュボードへ」を選択するとダッシュボードに戻る

## 設計の利点

### 1. シンプルな実装
- 外部ライブラリ不要
- 状態管理のみで実現
- 理解しやすく保守しやすい

### 2. 拡張性
- 新しい画面を簡単に追加可能
- Screen型を拡張するだけで対応

### 3. テスタビリティ
- 各画面は独立してテスト可能
- ナビゲーションロジックも単純でテストしやすい

## 今後の拡張

将来的に複雑なナビゲーションが必要になった場合は、React Navigationなどのライブラリへの移行を検討します。現在のシンプルな実装は、そのような移行を容易にする基盤となっています。
