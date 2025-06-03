// 結帳請求資料介面
export interface CheckoutRequest {
  // 金額相關
  totalAmount: number;           // 訂單小計(未含折扣、運費)
  discountAmount?: number;       // 折扣金額(預設0)
  shippingFee?: number;          // 運費(預設0)
  finalAmount: number;           // 最終金額
  discountCode?: string;         // 使用的折扣碼
  
  // 商品項目
  items: CheckoutItem[];
  
  // 付款與運送方式
  paymentMethod: 'WEBATM' | 'CREDIT'; // 付款方式(WEBATM、CREDIT)
  shippingMethod: string;             // 運送方式(homeDelivery)
  
  // 收件人資訊
  recipientName: string;    // 收件人姓名
  recipientEmail: string;   // 收件人Email
  recipientPhone: string;   // 收件人電話
  shippingAddress: string;  // 收件地址
  
  // 發票資訊
  invoiceType: string;      // 發票類型(e-invoice:電子發票、paper:紙本發票)
  carrierNum?: string;      // 手機條碼(首碼為/，後7碼英數字，只有0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+-這39個字元)
  
  // 備註
  note?: string;            // 訂單備註
}

// 結帳商品項目
export interface CheckoutItem {
  productId: number;  // 購買商品ID
  quantity: number;   // 購買商品數量
  price: number;      // 購買商品價格
}

// 付款資訊介面
export interface PaymentInfo {
  merchantID: string;
  tradeInfo: string;
  tradeSha: string;
  version: string;
  payGateWay: string;
}

// 結帳回應資料介面
export interface CheckoutResponse {
  status: boolean;
  message?: string;
  data?: PaymentInfo;
} 