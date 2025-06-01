# 加購商品API整合說明

## 概述

本文件說明如何整合後端API來動態載入加購商品，取代原本的靜態加購商品列表。
我們使用熱門商品API作為加購商品的資料來源，隨機選取商品顯示在加購區域。

## API 端點

```
GET /api/homepage?sectionName=popularProducts
```

## 預期回應格式

```json
{
  "status": true,
  "data": {
    "books": [
      {
        "id": 505,
        "title": "My Animal Friends",
        "imageUrl": "https://example.com/covers/animal_friends.jpg",
        "price": 300
      },
      {
        "id": 601,
        "title": "小熊的冒險",
        "imageUrl": "https://example.com/covers/bear_adventure.jpg",
        "price": 330
      }
      // ... 更多書籍
    ]
  }
}
```

## 實作說明

### 1. API 函數 (`lib/api/addOnItem.ts`)

- `fetchAddOnItems()`: 從後端熱門商品API獲取資料並轉換為加購商品格式
- `getRandomAddOnItems()`: 從加購商品中隨機選取指定數量的商品

### 2. 購物車Store更新 (`lib/store/useCartStore.ts`)

- 新增 `loadAddOnsFromAPI()` 方法來從API載入加購商品
- 新增 `isLoadingAddOns` 狀態來追蹤載入狀態
- 新增 `useLoadAddOns()` hook 來自動載入加購商品

### 3. 資料轉換

API回應的書籍資料會被轉換為加購商品格式：

```typescript
const addOns: AddOnItem[] = selectedBooks.map(book => ({
  productId: book.id,           // API的id對應到productId
  name: book.title,             // API的title對應到name
  price: book.price,            // API的price對應到price
  addOnPrice: Math.round(book.price * 0.5), // 加購價格為原價的50%
  imageUrl: book.imageUrl       // API的imageUrl對應到imageUrl
}));
```

### 4. 錯誤處理

如果API調用失敗，系統會自動回退到預設的加購商品列表，確保用戶體驗不受影響。

## 使用方式

### 在購物車頁面中使用

```typescript
import { useLoadAddOns } from "@/lib/store/useCartStore";

const { addOns, isLoadingAddOns } = useLoadAddOns();
```

### 手動載入加購商品

```typescript
import { useCartStore } from "@/lib/store/useCartStore";

const { loadAddOnsFromAPI } = useCartStore();

// 手動觸發載入
await loadAddOnsFromAPI();
```

### 直接使用API函數

```typescript
import { fetchAddOnItems, getRandomAddOnItems } from "@/lib/api/addOnItem";

// 獲取所有加購商品
const allAddOns = await fetchAddOnItems();

// 隨機選取4個
const randomAddOns = getRandomAddOnItems(allAddOns, 4);
```

## 測試

可以訪問 `/test-popular-products` 頁面來測試API功能：

- 顯示API回應的所有加購商品
- 顯示隨機選取的4個商品
- 顯示購物車Store中的加購商品
- 提供重新載入功能來測試API調用

## 特性

1. **自動載入**: 當購物車頁面載入時，如果沒有加購商品，會自動從API載入
2. **隨機選取**: 從所有熱門商品中隨機選取4個作為加購商品
3. **錯誤回退**: API失敗時自動使用預設的加購商品
4. **載入狀態**: 提供載入狀態指示器
5. **快取機制**: 使用Zustand的持久化功能，避免重複載入
6. **語義清晰**: 文件名稱和函數名稱明確表達用途（加購商品）

## 注意事項

- 加購價格統一為原價的50%
- 每次頁面載入都會重新隨機選取商品
- API回應必須符合預期格式，否則會使用預設商品
- 圖片載入失敗時會自動使用預設圖片
- 雖然使用熱門商品API，但目的是為了提供加購商品資料 