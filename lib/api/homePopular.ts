import apiClient, { ApiResponse } from '@/lib/apiClient';
import { BooksResponse } from '@/lib/types/book';

/**
 * 獲取首頁熱門商品
 * @returns Promise<PopularProductsResponse['data']> 熱門商品數據
 */
export async function fetchPopularProducts(): Promise<BooksResponse['data']> {
  try {
    console.log('正在獲取首頁熱門商品數據...');
  
    // 使用 apiClient 呼叫 API
    // apiClient 的攔截器已經處理了回傳 response.data
    const response: ApiResponse<BooksResponse['data']> = await apiClient.get(
      '/api/homepage?sectionName=popularProducts'
    );

    console.log('熱門商品 API 回應:', response);
    
    if (!response.status || !response.data) {
      throw new Error(response.message || '獲取熱門商品失敗');
    }
    
    return response.data;
  } catch (error) {
    console.error('獲取熱門商品時發生錯誤:', error);
    throw new Error('無法載入熱門商品資料');
  }
}
