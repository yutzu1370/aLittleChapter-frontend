import apiClient, { ApiResponse } from "@/lib/apiClient";

// 收藏商品的資料類型
export interface WishlistItem {
  productId: number;
  title: string;
  coverImage: string;
  price: number;
  discountPrice: number | null;
  quantity: number;
  stockQuantity: number;
}

// 獲取收藏清單的回應類型
export interface WishlistResponse {
  status: boolean;
  message: string;
  data: WishlistItem[];
}

// 獲取收藏清單
export async function getWishlistApi(): Promise<ApiResponse<WishlistItem[]>> {
  return apiClient.get('/api/wishlist');
}

// 新增商品到收藏清單
export async function addToWishlistApi(productId: number): Promise<ApiResponse> {
  return apiClient.post('/api/wishlist', { productId });
}

// 從收藏清單移除商品
export async function removeFromWishlistApi(productId: number): Promise<ApiResponse> {
  return apiClient.delete(`/api/wishlist/${productId}`);
} 