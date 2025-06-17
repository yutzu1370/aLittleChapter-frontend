# 搜尋篩選資料流程說明

## 資料流程概覽

本文件詳細說明在產品頁面 (`/products`) 中搜尋篩選的完整資料流程，特別是如何確保從別頁點擊過來時能正確重置篩選條件。

## 主要組件架構

```
page.tsx (主頁面)
├── CategoryFilter.tsx (分類篩選)
├── FilterSidebar.tsx (側邊篩選欄)
├── ProductList.tsx (商品列表)
└── useProductSearchStore.ts (狀態管理)
```

## 詳細資料流程

### 1. 頁面初始化 (`page.tsx`)

當使用者進入 `/products` 頁面時：

```typescript
// 檢查 URL 參數
const hasSearchParams = 
  searchParams.get("keyword") ||
  searchParams.get("category_id") ||
  searchParams.get("age_range_id") ||
  searchParams.get("is_bestseller") ||
  searchParams.get("is_new_arrival") ||
  searchParams.get("is_discount");

if (hasSearchParams) {
  // 情況 A：有 URL 參數
  initFromQuery(searchParams);
} else {
  // 情況 B：無 URL 參數
  clearFilters();
}
```

### 2. 情況 A：從別頁帶參數點擊過來

#### 例子：使用者點擊分類連結 `/products?category_id=5`

**步驟 1：** `initFromQuery()` 被調用
```typescript
// ⭐ 關鍵：先完全重置所有篩選條件
const resetState = {
  searchKeyword: '',
  activeCategory: '全部作品',
  activeAgeFilters: [],
  activeThemeFilters: [],
  activePriceFilter: null,
  authorKeyword: '',
  publisherKeyword: '',
  currentPage: 1
};

// 然後根據 URL 參數設定對應值
if (categoryId === "5") {
  resetState.activeCategory = "勵志成長";
}
```

**步驟 2：** 狀態更新並觸發查詢
```typescript
set(resetState);  // 更新 store 狀態
get().fetchProducts();  // 觸發 API 查詢
```

**步驟 3：** 組件狀態同步
- `CategoryFilter`: `activeCategory` 變化，UI 顯示 "勵志成長" 為選中狀態
- `FilterSidebar`: 檢測到篩選條件重置，本地輸入框清空，展開狀態重置

### 3. 情況 B：直接進入頁面或無參數

**步驟 1：** `clearFilters()` 被調用
```typescript
set({
  searchKeyword: '',
  activeCategory: '全部作品',
  activeAgeFilters: [],
  activeThemeFilters: [],
  activePriceFilter: null,
  authorKeyword: '',
  publisherKeyword: '',
  currentPage: 1
});
```

**步驟 2：** 載入預設商品
```typescript
get().fetchProducts();  // 載入所有商品
```

### 4. 使用者互動篩選

#### 4.1 分類篩選 (`CategoryFilter`)
```typescript
const handleCategoryClick = (category: string) => {
  setActiveCategory(category);  // 更新分類並觸發查詢
};
```

#### 4.2 側邊篩選 (`FilterSidebar`)
```typescript
// 年齡篩選
toggleAgeFilter(filter);  // 切換年齡篩選並觸發查詢

// 主題篩選  
toggleThemeFilter(filter);  // 切換主題篩選並觸發查詢

// 價格篩選
setPriceFilter(price);  // 設定價格篩選並觸發查詢

// 作者/出版社搜尋（有防抖動）
handleAuthorInput -> (1秒後) -> setAuthorKeyword -> 觸發查詢
```

### 5. API 查詢邏輯 (`fetchProducts`)

每次篩選條件變更都會觸發：

```typescript
const filters = {
  keyword: state.searchKeyword || undefined,
  author: state.authorKeyword || undefined,
  publisher: state.publisherKeyword || undefined,
  page: state.currentPage,
  ...getCategoryFilters(state.activeCategory),  // 轉換分類到 API 參數
};

// 處理多選篩選
if (ageIds) filters.age_range_id = ageIds;
if (themeIds) filters.category_id = themeIds;
if (priceFilter) filters.price_range = getPriceRange(priceFilter);
```

## 重要特性

### ✅ 確保狀態重置
- 每次從 URL 參數初始化時，都會**完全重置**所有篩選條件
- 避免之前的搜尋條件干擾新的查詢

### ✅ 組件狀態同步
- Store 狀態變化時，所有相關組件會自動同步
- 本地輸入狀態（如作者、出版社輸入框）會正確重置

### ✅ 性能優化
- 作者/出版社搜尋有 1 秒防抖動
- 避免頻繁的 API 請求

### ✅ 用戶體驗
- 載入狀態和錯誤處理
- 清除篩選按鈕
- 詳細的控制台日誌便於除錯

## 常見使用場景

### 場景 1：從首頁點擊分類
```
首頁 -> 點擊 "科學知識" -> `/products?category_id=2`
結果：只顯示科學知識分類，其他篩選條件為空
```

### 場景 2：從搜尋結果進入
```
搜尋 "恐龍" -> `/products?keyword=恐龍`
結果：只顯示包含恐龍關鍵字的商品，其他篩選條件為空
```

### 場景 3：使用者在頁面內篩選
```
在產品頁面內 -> 選擇年齡 "3-5歲" + 主題 "藝術啟蒙"
結果：同時應用兩個篩選條件
```

## 除錯提示

所有關鍵操作都有詳細的控制台日誌：
- `[ProductsPage]`: 頁面初始化和 URL 參數檢查
- `[ProductSearchStore]`: Store 狀態變更和 API 查詢
- `[CategoryFilter]`: 分類選擇
- `[FilterSidebar]`: 側邊篩選操作

查看瀏覽器控制台可以追蹤完整的資料流程。 