# 結帳 API 說明文件

## API 端點
```
POST https://little-chapter-backend.onrender.com/api/checkout
```

> **注意**：這是外部後端 API，前端透過 `apiClient` 調用

## 架構說明

```
前端頁面 → lib/api/checkout.ts → apiClient → 外部後端 API
```

- **前端**：`app/cart/checkout/page.tsx`
- **API 客戶端**：`lib/api/checkout.ts` 
- **外部後端**：`https://little-chapter-backend.onrender.com/api/checkout`

## 請求格式
Content-Type: `application/json`

## 請求參數

### 必要欄位

| 欄位名稱 | 類型 | 必要 | 說明 |
|---------|------|------|------|
| totalAmount | Number | Yes | 訂單小計(未含折扣、運費) |
| finalAmount | Number | Yes | 最終金額 |
| items[] | Array | Yes | 購買商品清單 |
| items[].productId | Number | Yes | 購買商品ID |
| items[].quantity | Number | Yes | 購買商品數量 |
| items[].price | Number | Yes | 購買商品價格 |
| paymentMethod | String | Yes | 付款方式(WEBATM、CREDIT) |
| shippingMethod | String | Yes | 運送方式(homeDelivery) |
| recipientName | String | Yes | 收件人姓名 |
| recipientEmail | String | Yes | 收件人Email |
| recipientPhone | String | Yes | 收件人電話 |
| shippingAddress | String | Yes | 收件地址 |
| invoiceType | String | Yes | 發票類型(e-invoice:電子發票、paper:紙本發票) |

### 可選欄位

| 欄位名稱 | 類型 | 必要 | 說明 |
|---------|------|------|------|
| discountAmount | Number | No | 折扣金額(預設0) |
| shippingFee | Number | No | 運費(預設0) |
| discountCode | String | No | 使用的折扣碼 |
| carrierNum | String | No | 手機條碼(首碼為/，後7碼英數字，只有0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+-這39個字元) |
| note | String | No | 訂單備註 |

## 請求範例

```json
{
  "totalAmount": 600,
  "discountAmount": 50,
  "shippingFee": 60,
  "finalAmount": 610,
  "discountCode": "SAVE50",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 300
    }
  ],
  "paymentMethod": "CREDIT",
  "shippingMethod": "homeDelivery",
  "recipientName": "王小明",
  "recipientEmail": "wang@example.com",
  "recipientPhone": "0912345678",
  "shippingAddress": "台北市信義區信義路五段7號",
  "invoiceType": "e-invoice",
  "carrierNum": "/ABC1234",
  "note": "請小心包裝"
}
```

## 回應格式

### 成功回應
```json
{
  "status": true,
  "message": "訂單建立成功",
  "data": {
    "orderId": "ORD17123456781234",
    "paymentUrl": "/cart/payment?orderId=ORD17123456781234&method=credit",
    "redirectUrl": "/cart/payment-redirect?orderId=ORD17123456781234"
  }
}
```

### 失敗回應
```json
{
  "status": false,
  "message": "錯誤訊息說明"
}
```

## 錯誤代碼

| HTTP 狀態碼 | 說明 |
|------------|------|
| 400 | 請求參數錯誤 |
| 500 | 伺服器內部錯誤 |

## 驗證規則

### Email 格式驗證
- 必須符合標準 Email 格式：`example@domain.com`

### 電話號碼驗證
- 必須是09開頭的10位數字：`09xxxxxxxx`

### 手機條碼驗證（電子發票時）
- 格式：首碼為 `/` 加7碼英數字，共8碼
- 允許字元：`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+-`
- 範例：`/ABC1234`

### 付款方式
- `CREDIT`: 信用卡付款
- `WEBATM`: ATM轉帳

### 發票類型
- `e-invoice` 或 `電子發票`: 電子發票
- `paper` 或 `紙本發票`: 紙本發票

## 使用方式

### 前端調用範例

```javascript
import { submitCheckoutApi } from '@/lib/api/checkout';

const handleCheckout = async (checkoutData) => {
  try {
    const response = await submitCheckoutApi(checkoutData);
    
    if (response.status && response.data) {
      // 結帳成功，導向付款頁面
      window.location.href = response.data.redirectUrl;
    } else {
      // 結帳失敗，顯示錯誤訊息
      alert(response.message || '結帳失敗，請稍後再試');
    }
  } catch (error) {
    console.error('結帳錯誤:', error);
    alert('結帳過程中發生錯誤，請稍後再試');
  }
};
```

## 技術實作

### API 客戶端設定
```typescript
// lib/apiClient.ts 會自動處理：
// 1. 基礎 URL：https://little-chapter-backend.onrender.com
// 2. 認證 Token（如果需要）
// 3. 請求/回應攔截器
// 4. 錯誤處理
```

### 資料流程
1. 使用者填寫結帳表單
2. 前端驗證資料格式
3. 調用 `submitCheckoutApi()`
4. `apiClient` 發送請求到外部後端
5. 後端處理並回傳結果
6. 前端根據結果導向對應頁面

## 注意事項

1. 所有金額欄位都應該是正數
2. 商品數量必須大於0
3. 當選擇電子發票時，手機條碼為必填欄位
4. API 會自動生成唯一的訂單ID
5. 成功後會返回對應的付款頁面URL
6. **重要**：此 API 調用外部後端，需確保網路連線正常 