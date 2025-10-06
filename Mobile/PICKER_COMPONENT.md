# Pickerコンポーネント

## 概要
汎用的なコンボボックス（ドロップダウン選択）コンポーネントです。モーダル形式でリストから項目を選択できます。

## 主な機能

### 1. モーダル形式の選択UI
- タップでモーダルが開き、項目リストが表示される
- オーバーレイ背景をタップで閉じる
- ✕ボタンで閉じる

### 2. 検索機能
- 項目が5個以上の場合、自動的に検索ボックスが表示される
- リアルタイムで絞り込み検索が可能
- 大文字小文字を区別しない

### 3. 選択状態の視覚的フィードバック
- 選択中の項目は背景色が変わる
- ✓マークで選択状態を明示
- プレースホルダーとの区別が明確

### 4. 編集可能/不可の制御
- `editable`プロパティで編集の可否を制御
- 編集不可の場合は見た目が変わり、タップできない

## 使用方法

### 基本的な使用例

```typescript
import { Picker } from '../components/Picker';

const [selectedCategory, setSelectedCategory] = useState('');

<Picker
  value={selectedCategory}
  items={['野菜類', '肉類', '魚介類']}
  onValueChange={(value) => setSelectedCategory(value)}
  placeholder="選択してください"
/>
```

### InputCameraScreenでの使用例

```typescript
// 大分類の選択
<Picker
  value={item.category}
  items={CATEGORIES}
  onValueChange={text => handleItemEdit(index, 'category', text)}
  placeholder="選択してください"
  style={styles.itemInput}
/>

// 小分類の選択（大分類に応じて選択肢が変化）
const subCategoryOptions = SUB_CATEGORIES[item.category] || SUB_CATEGORIES['その他'];
<Picker
  value={item.subCategory}
  items={subCategoryOptions}
  onValueChange={text => handleItemEdit(index, 'subCategory', text)}
  placeholder="選択してください"
  style={styles.itemInput}
/>

// 単位の選択
<Picker
  value={item.unit}
  items={UNITS}
  onValueChange={text => handleItemEdit(index, 'unit', text)}
  placeholder="単位"
  style={styles.itemInputSmall}
/>
```

## プロパティ

| プロパティ名 | 型 | 必須 | デフォルト | 説明 |
|------------|-----|-----|-----------|------|
| value | string | ✓ | - | 現在選択されている値 |
| items | string[] | ✓ | - | 選択可能な項目のリスト |
| onValueChange | (value: string) => void | ✓ | - | 値変更時のコールバック |
| placeholder | string | - | '選択してください' | 値が未選択の場合の表示テキスト |
| editable | boolean | - | true | 編集可能かどうか |
| style | any | - | - | スタイルのカスタマイズ |

## 選択肢の定義例

### 大分類
```typescript
const CATEGORIES = [
  '野菜類',
  '肉類',
  '魚介類',
  '乳製品',
  '調味料',
  '飲料',
  '果物',
  '穀類',
  '卵',
  '豆類',
  '加工食品',
  'その他',
];
```

### 小分類（大分類に応じて変化）
```typescript
const SUB_CATEGORIES: { [key: string]: string[] } = {
  野菜類: ['葉物', '根菜', 'きのこ類', 'その他'],
  肉類: ['牛肉', '豚肉', '鶏肉', 'ひき肉', 'その他'],
  魚介類: ['魚', '貝類', '海藻', 'その他'],
  // ...
};
```

### 単位
```typescript
const UNITS = [
  'g', 'kg', 'ml', 'L',
  '個', '本', '枚', '束',
  'パック', '袋', '缶', '瓶',
  '箱', 'その他',
];
```

## スタイリング

コンポーネント内部で定義されているスタイル：
- `selector`: 選択ボックスの外観
- `selectorText`: 選択された値のテキスト
- `arrow`: ▼マーク
- `modalContent`: モーダルのコンテンツ
- `item`: リスト内の各項目
- `selectedItem`: 選択中の項目（背景色）

外部からのスタイルカスタマイズも可能：
```typescript
<Picker
  // ...
  style={{ flex: 1, marginRight: 8 }}
/>
```

## 実装の詳細

### 検索機能の実装
```typescript
const filteredItems = items.filter(item =>
  item.toLowerCase().includes(searchText.toLowerCase()),
);
```

### モーダルの開閉
```typescript
const [modalVisible, setModalVisible] = useState(false);

// 開く
setModalVisible(true);

// 閉じる
setModalVisible(false);
setSearchText('');
```

### 選択時の処理
```typescript
const handleSelect = (item: string) => {
  onValueChange(item);
  setModalVisible(false);
  setSearchText('');
};
```

## テスト

`__tests__/Picker.test.tsx`にて以下をテスト：
- コンポーネントが正しく定義されているか
- 必須プロパティを受け取れるか
- プロパティが正しく渡されるか

## 今後の拡張案

1. **複数選択モード**
   - チェックボックスで複数項目を選択可能に
   
2. **グループ化**
   - 項目をグループ分けして表示
   
3. **カスタムアイテムレンダラー**
   - アイコンや画像付きの項目表示
   
4. **キーボードナビゲーション**
   - 矢印キーでの選択
   
5. **無限スクロール**
   - 大量のデータに対応

## 関連ファイル

- `Mobile/src/presentation/components/Picker.tsx` - コンポーネント本体
- `Mobile/__tests__/Picker.test.tsx` - テストファイル
- `Mobile/src/presentation/screens/InputCameraScreen.tsx` - 使用例
