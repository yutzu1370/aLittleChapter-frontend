import apiClient, { ApiResponse } from "@/lib/apiClient";

// 購物車項目介面 - 用於 API 傳輸
export interface CartItemRequest {
  productId: number;
  quantity: number;
}

// 同步購物車到後端
export async function syncCartToBackendApi(cartItems: CartItemRequest[]): Promise<ApiResponse> {
  try {
    // 逐一發送每個購物車項目到後端
    const promises = cartItems.map(item => 
      apiClient.post('/api/cart', item)
    );
    
    // 等待所有請求完成
    const results = await Promise.allSettled(promises);
    
    // 檢查是否有失敗的請求
    const failedRequests = results.filter(result => result.status === 'rejected');
    
    if (failedRequests.length > 0) {
      console.error('部分購物車項目同步失敗:', failedRequests);
      return {
        status: false,
        message: `${failedRequests.length} 個商品同步失敗`,
      };
    }
    
    // 取得第一個成功回應的 status 和 message
    const firstSuccessResult = results.find(result => result.status === 'fulfilled') as any;
    const backendStatus = firstSuccessResult?.value?.status ?? true;
    const backendMessage = firstSuccessResult?.value?.message || '購物車同步成功';
    
    return {
      status: backendStatus,
      message: backendMessage,
      data: results
    };
  } catch (error) {
    console.error('購物車同步失敗:', error);
    return {
      status: false,
      message: '購物車同步失敗',
    };
  }
}

// 獲取後端購物車資料
export async function getCartFromBackendApi(): Promise<ApiResponse> {
  return apiClient.get('/api/cart');
}

// 清空後端購物車
export async function clearCartInBackendApi(): Promise<ApiResponse> {
  return apiClient.delete('/api/cart');
} 