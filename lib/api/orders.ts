import apiClient, { ApiResponse } from "@/lib/apiClient";

export interface OrderItem {
  productId: number
  productTitle: string
  author: string
  quantity: number
  itemAmount: number
  imageUrl: string
}

export interface Order {
  id: string
  orderNumber: string
  createdAt: string
  totalQuantity: number
  finalAmount: number
  totalAmount: number
  discountAmount: number
  shippingFee: number
  orderStatus: "pending" | "shipped" | "completed" | "cancelled"
  paymentStatus: "paid" | "refunded"
  shippingStatus: "notReceived" | "processing" | "inTransit" | "delivered" | "returned"
  items?: OrderItem[]
}

export interface OrdersResponse {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  orders: Order[]
}

export interface GetOrdersParams {
  page?: number
  limit?: number

}

// 獲取訂單列表
export async function getOrders(params: GetOrdersParams = {}): Promise<ApiResponse<OrdersResponse>> {
  const { page = 1, limit = 20 } = params;
  
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  console.log('🔍 [Orders API] 請求參數:', { page, limit });
  console.log('🔍 [Orders API] 請求 URL:', `/api/orders?${queryParams.toString()}`);
  
  try {
    const response: ApiResponse<OrdersResponse> = await apiClient.get(`/api/orders?${queryParams.toString()}`);
    console.log('✅ [Orders API] 回應資料:', response);
    console.log('📊 [Orders API] 訂單數量:', response.data?.orders?.length || 0);
    console.log('📄 [Orders API] 分頁資訊:', response.data?.pagination);
    return response;
  } catch (error) {
    console.error('❌ [Orders API] 請求失敗:', error);
    throw error;
  }
}

// 獲取單一訂單詳情 - 使用 orderNumber
export async function getOrderByNumber(orderNumber: string): Promise<ApiResponse<Order>> {
  console.log('🔍 [Order Detail API] 請求訂單編號:', orderNumber);
  
  try {
    const response: ApiResponse<Order> = await apiClient.get(`/api/orders/${orderNumber}`);
    console.log('✅ [Order Detail API] 回應資料:', response);
    return response;
  } catch (error) {
    console.error('❌ [Order Detail API] 請求失敗:', error);
    throw error;
  }
}

// 獲取單一訂單詳情 - 使用 orderId (保留向後相容)
export async function getOrderById(orderId: string): Promise<ApiResponse<Order>> {
  console.log('🔍 [Order Detail API] 請求訂單 ID:', orderId);
  
  try {
    const response: ApiResponse<Order> = await apiClient.get(`/api/orders/${orderId}`);
    console.log('✅ [Order Detail API] 回應資料:', response);
    return response;
  } catch (error) {
    console.error('❌ [Order Detail API] 請求失敗:', error);
    throw error;
  }
}

// 評價資料介面
export interface ReviewData {
  rating: number;
  content: string;
}

// 提交商品評價
export async function submitReviewApi(orderNumber: string, productId: number, reviewData: ReviewData): Promise<ApiResponse> {
  console.log('🔍 [Review API] 提交評價:', { orderNumber, productId, reviewData });
  
  try {
    const response: ApiResponse = await apiClient.post(`/api/orders/${orderNumber}/products/${productId}/reviews`, reviewData);
    console.log('✅ [Review API] 回應資料:', response);
    return response;
  } catch (error) {
    console.error('❌ [Review API] 請求失敗:', error);
    throw error;
  }
}

// 訂單操作類型
export type OrderActionType = 'cancel' | 'return';

// 訂單操作資料
export interface OrderActionData {
  orderNumber: string;
}

// 訂單操作 API
export async function orderActionApi(type: OrderActionType, data: OrderActionData): Promise<ApiResponse> {
  console.log('🔍 [Order Action API] 訂單操作:', { type, data });
  
  try {
    const response: ApiResponse = await apiClient.post(`/api/orders/action?type=${type}`, data);
    console.log('✅ [Order Action API] 回應資料:', response);
    return response;
  } catch (error) {
    console.error('❌ [Order Action API] 請求失敗:', error);
    throw error;
  }
} 

