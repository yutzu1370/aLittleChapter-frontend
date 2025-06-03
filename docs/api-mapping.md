# 前端與後端 API 欄位對應表

## 📋 **結帳 API 欄位對應**

### ✅ **金額相關欄位**
| 後端API欄位 | 前端實作 | 類型 | 說明 |
|------------|---------|------|------|
| `totalAmount` | `subtotal + addOnSubtotal` | Number | 訂單小計(未含折扣、運費) |
| `discountAmount` | `appliedDiscount?.discountAmount \|\| 0` | Number | 折扣金額(預設0) |
| `shippingFee` | `shippingFee` | Number | 運費(預設0) |
| `finalAmount` | `subtotal + addOnSubtotal + shippingFee - discount` | Number | 最終金額 |
| `discountCode` | `appliedDiscount?.code` | String | 使用的折扣碼 |

### ✅ **商品項目欄位**
| 後端API欄位 | 前端實作 | 類型 | 說明 |
|------------|---------|------|------|
| `items[].productId` | `item.productId` | Number | 購買商品ID |
| `items[].quantity` | `item.quantity` | Number | 購買商品數量 |
| `items[].price` | `item.discountPrice` (一般商品) / `item.addOnPrice` (加購商品) | Number | 購買商品價格 |

### ✅ **付款與運送方式**
| 後端API欄位 | 前端實作 | 類型 | 對應邏輯 |
|------------|---------|------|---------|
| `paymentMethod` | 表單選擇值轉換 | String | `'信用卡'` → `'CREDIT'`<br>`'ATM匯款'` → `'WEBATM'` |
| `shippingMethod` | `'homeDelivery'` | String | 固定值：宅配到府 |

### ✅ **收件人資訊**
| 後端API欄位 | 前端實作 | 類型 | 表單欄位 |
|------------|---------|------|---------|
| `recipientName` | `formData.get('name')` | String | 收件人姓名輸入框 |
| `recipientEmail` | `formData.get('email')` | String | Email輸入框 |
| `recipientPhone` | `formData.get('phone')` | String | 電話輸入框 |
| `shippingAddress` | `${city}${district}${address}` | String | 縣市+鄉鎮區+詳細地址 |

### ✅ **發票資訊**
| 後端API欄位 | 前端實作 | 類型 | 對應邏輯 |
|------------|---------|------|---------|
| `invoiceType` | 表單選擇值轉換 | String | `'電子發票'` → `'e-invoice'`<br>`'紙本發票'` → `'paper'` |
| `carrierNum` | `mobileBarcode` (當選擇電子發票時) | String | 手機條碼輸入框 |

### ✅ **其他欄位**
| 後端API欄位 | 前端實作 | 類型 | 說明 |
|------------|---------|------|------|
| `note` | `formData.get('note')` | String | 備註輸入框 |

## 🔧 **資料轉換邏輯**

### 付款方式轉換
```typescript
paymentMethod: paymentMethod === '信用卡' ? 'CREDIT' : 
               paymentMethod === 'ATM匯款' ? 'WEBATM' : 'CREDIT'
```

### 發票類型轉換
```typescript
invoiceType: deviceType === '電子發票' ? 'e-invoice' : 
             deviceType === '紙本發票' ? 'paper' : deviceType
```

### 地址組合
```typescript
shippingAddress: `${city}${district}${address}`
// 例如：台北市信義區信義路五段7號
```

### 商品項目組合
```typescript
const checkoutItems: CheckoutItem[] = [
  // 一般商品
  ...selectedItems.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.discountPrice
  })),
  // 加購商品
  ...addedOnItems.map(item => ({
    productId: item.productId,
    quantity: item.quantity || 1,
    price: item.addOnPrice
  }))
]
```

## ✅ **驗證確認**

所有欄位都已正確對應後端API規格，包括：
- ✅ 金額計算邏輯
- ✅ 商品項目格式
- ✅ 付款方式轉換
- ✅ 發票類型轉換
- ✅ 收件人資訊
- ✅ 地址組合
- ✅ 可選欄位處理 