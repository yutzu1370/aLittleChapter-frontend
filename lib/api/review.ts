import apiClient, { ApiResponse } from "@/lib/apiClient";

// 評論資料介面
export interface ReviewData {
  productId: number;
  productTitle: string;
  productImageUrl: string;
  content: string;
  rating: number;
  username: string;
  userAvatar: string;
  createdAt: string;
}

// 評論 API 回應格式
export interface ReviewsResponse {
  averageRating: number;
  reviewCount: number;
  reviews: ReviewData[];
}

// 獲取所有評論
export async function getAllReviewsApi(): Promise<ApiResponse<ReviewsResponse>> {

  try {
    const response: ApiResponse<ReviewsResponse> = await apiClient.get('/api/products/reviews');
  
    return response;
  } catch (error) {
   
    throw error;
  }
}

// 根據商品 ID 獲取評論
export async function getReviewsByProductIdApi(productId: number): Promise<ApiResponse<ReviewsResponse>> {

  
  try {
    const response: ApiResponse<ReviewsResponse> = await apiClient.get(`/api/products/reviews?productId=${productId}`);

    return response;
  } catch (error) {

    throw error;
  }
}
