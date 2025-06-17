import apiClient, { ApiResponse } from "@/lib/apiClient";
import { CheckoutRequest, CheckoutResponse, PaymentInfo } from "@/lib/types/checkout";

// 提交結帳請求
export async function submitCheckoutApi(checkoutData: CheckoutRequest): Promise<PaymentInfo> {
  try {
    const response: ApiResponse<PaymentInfo> = await apiClient.post('/api/checkout', checkoutData);
    
    // 檢查 API 回應狀態
    if (!response.status) {
      throw new Error(response.message || '結帳處理失敗');
    }
    
    // 檢查 data 是否存在且為有效的 PaymentInfo
    if (!response.data) {
      throw new Error('未收到付款資訊');
    }
    
    // 檢查 data 是否為錯誤回應（包含 status 欄位）
    if (typeof response.data === 'object' && 'status' in response.data) {
      const dataWithStatus = response.data as any;
      if (dataWithStatus.status === false) {
        throw new Error(dataWithStatus.message || '付款處理失敗');
      }
    }
    
    return response.data;
  } catch (error) {

    throw new Error(error instanceof Error ? error.message : '結帳請求失敗，請稍後再試');
  }
} 