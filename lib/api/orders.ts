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
  orderStatus: "pending" | "shipped" | "completed" | "cancelled" | "returnRequested" | "returnAccepted" | "returnRejected"
  paymentStatus: "paid" | "refunded" | "authorizationVoided"
  shippingStatus: "notReceived" | "processing" | "inTransit" | "delivered" | "returned"
  paymentMethod: string
  paidAt: string
  shippedAt: string
  completedAt: string
  returnAt: string
  transactionNumber: string
  trackingNumber: string
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

  
  try {
    const response: ApiResponse<OrdersResponse> = await apiClient.get(`/api/orders?${queryParams.toString()}`);
   
    return response;
  } catch (error) {
 
    throw error;
  }
}

// 獲取單一訂單詳情 - 使用 orderNumber
export async function getOrderByNumber(orderNumber: string): Promise<ApiResponse<Order>> {
 
  
  try {
    const response: ApiResponse<Order> = await apiClient.get(`/api/orders/${orderNumber}`);
  
    return response;
  } catch (error) {

    throw error;
  }
}

// 獲取單一訂單詳情 - 使用 orderId (保留向後相容)
export async function getOrderById(orderId: string): Promise<ApiResponse<Order>> {

  
  try {
    const response: ApiResponse<Order> = await apiClient.get(`/api/orders/${orderId}`);
  
    return response;
  } catch (error) {

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
  
  
  try {
    const response: ApiResponse = await apiClient.post(`/api/orders/${orderNumber}/products/${productId}/reviews`, reviewData);
    
    return response;
  } catch (error) {
  
    throw error;
  }
}

// 訂單操作類型
export type OrderActionType = 'cancel' | 'return';

// 訂單操作資料
export interface OrderActionData {
  orderNumber: string;
  returnReason?: string;
}

// 訂單操作 API
export async function orderActionApi(type: OrderActionType, data: OrderActionData): Promise<ApiResponse> {

  try {
    const response: ApiResponse = await apiClient.post(`/api/orders/action?type=${type}`, data);
   
    return response;
  } catch (error) {

    throw error;
  }
} 

