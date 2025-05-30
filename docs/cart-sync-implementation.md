# 購物車同步功能實作說明

## 功能概述

當使用者登入成功後，系統會自動將訪客時期儲存在 localStorage 中的購物車資料同步到後端。

## 實作內容

### 1. 購物車 API 函數 (`lib/api/cart.ts`)

- `syncCartToBackendApi()`: 同步購物車到後端
- `getCartFromBackendApi()`: 獲取後端購物車資料  
- `clearCartInBackendApi()`: 清空後端購物車

### 2. 購物車 Store 更新 (`lib/store/useCartStore.ts`)

- 新增 `syncCartToBackend()` 方法
- 將 localStorage 中的購物車項目轉換為 API 所需格式
- 支援批量同步多個商品

### 3. 認證 Store 更新 (`lib/store/useAuthStore.ts`)

- 修改 `login()` 函數為異步
- 登入成功後自動檢查並同步購物車
- 使用動態導入避免循環依賴

### 4. 認證模態框更新 (`components/auth/AuthModal.tsx`)

- 更新登入成功處理邏輯
- 支援異步登入流程

## API 資料格式

### 請求格式
```json
{
  "productsId": "101",
  "quantity": 1
}
```

### 回應格式
```json
{
  "status": true,
  "message": "購物車同步成功",
  "data": {...}
}
```

## 使用流程

1. **訪客狀態**: 使用者在未登入時加入商品到購物車，資料儲存在 localStorage
2. **登入觸發**: 使用者登入成功後，系統自動檢查 localStorage 中的購物車
3. **資料轉換**: 將購物車項目轉換為 API 所需的格式
4. **批量同步**: 使用 `Promise.allSettled()` 批量發送 POST 請求到 `/api/cart`
5. **結果處理**: 記錄同步結果，顯示相應的提示訊息

## 測試頁面

訪問 `/test-cart-sync` 可以測試購物車同步功能：

1. 加入商品到購物車（模擬訪客狀態）
2. 點擊模擬登入按鈕
3. 觀察 Console 和 Network 標籤查看同步過程

## 技術特點

- **非阻塞**: 同步過程不會影響登入流程
- **錯誤處理**: 完整的錯誤處理和日誌記錄
- **批量處理**: 支援多個商品同時同步
- **類型安全**: 完整的 TypeScript 類型定義
- **避免循環依賴**: 使用動態導入解決模組依賴問題

## 注意事項

- 同步失敗不會影響登入狀態
- 本地購物車資料在同步後仍會保留（可根據需求調整）
- 支援部分同步失敗的情況處理 