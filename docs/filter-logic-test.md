# 篩選邏輯測試驗證

## 修正後的邏輯說明

### 1. CategoryFilter (分類篩選)
- **範圍**：["全部作品", "亮點新書", "熱銷排行", "優惠折扣"]
- **功能**：單選，對應特殊分類查詢
- **API 對應**：
  - "亮點新書" → `is_new_arrival: true`
  - "熱銷排行" → `is_bestseller: true`
  - "優惠折扣" → `is_discount: true`

### 2. FilterSidebar 主題篩選
- **範圍**：["健康生活", "科學知識", "藝術啟蒙", "音樂欣賞", "勵志成長"]
- **功能**：多選，可以同時選擇多個主題
- **API 對應**：`category_id: "1,2,3"` (多個 ID 用逗號分隔)

### 3. FilterSidebar 年齡篩選
- **範圍**：["0-3 歲", "3-5 歲", "5-7 歲", "7-11 歲", "11-13 歲"]
- **功能**：多選，可以同時選擇多個年齡段
- **API 對應**：`age_range_id: "1,2,3"` (多個 ID 用逗號分隔)

## 測試案例

### 測試案例 1：URL 參數 - 主題篩選
```
URL: /products?category_id=2
期望結果：
- CategoryFilter: "全部作品" 選中
- FilterSidebar: "科學知識" 打勾，主題區塊自動展開
- 其他篩選：全部清空
```

### 測試案例 2：URL 參數 - 年齡篩選
```
URL: /products?age_range_id=2
期望結果：
- CategoryFilter: "全部作品" 選中
- FilterSidebar: "3-5 歲" 打勾，年齡區塊自動展開
- 其他篩選：全部清空
```

### 測試案例 3：URL 參數 - 特殊分類
```
URL: /products?is_bestseller=true
期望結果：
- CategoryFilter: "熱銷排行" 選中
- FilterSidebar: 所有篩選清空
```

### 測試案例 4：複合篩選
```
使用者操作：
1. 選擇 CategoryFilter "亮點新書"
2. 選擇 FilterSidebar "科學知識" + "3-5 歲"

期望結果：
- API 查詢參數：is_new_arrival=true&category_id=2&age_range_id=2
- 同時應用三個篩選條件
```

### 測試案例 5：從別頁進入重置
```
情境：
1. 使用者在頁面內設定了複雜篩選
2. 從首頁點擊 "科學知識" 分類

期望結果：
- 所有之前的篩選條件被清空
- 只有 "科學知識" 主題被選中
- URL: /products?category_id=2
```

## 驗證步驟

1. **開啟瀏覽器控制台**，查看詳細日誌
2. **測試 URL 參數**：直接在網址列輸入測試 URL
3. **檢查 UI 狀態**：確認對應的選項有正確的視覺反饋
4. **驗證 API 請求**：在網路面板檢查發送的查詢參數
5. **測試組合篩選**：嘗試多個篩選條件的組合

## 關鍵改進點

✅ **分離分類和主題**：CategoryFilter 和 FilterSidebar 的主題篩選分開處理
✅ **URL 參數對應**：category_id 現在對應到 FilterSidebar 的主題篩選
✅ **自動展開區塊**：有篩選條件時自動展開對應區塊
✅ **狀態重置**：從 URL 進入時完全重置之前的篩選條件
✅ **多選支援**：年齡和主題篩選支援多選 