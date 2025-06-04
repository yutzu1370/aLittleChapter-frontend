import apiClient, { ApiResponse } from '@/lib/apiClient';

// 定義 API 響應類型
export type PopularProductsResponse = {
  status: boolean;
  data: {
    title: string;
    books: Array<{
      id: number;
      title: string;
      author: string;
      publisher: string;
      price: number;
      imageUrl: string;
      categoryName: string;
      ageRangeName: string;
      isNewArrival: boolean;
      isBestseller: boolean;
      isDiscount: boolean;
      discountPrice: number | null;
    }>;
  };
};

/**
 * 獲取首頁熱門商品
 * @returns Promise<PopularProductsResponse['data']> 熱門商品數據
 */
export async function fetchPopularProducts(): Promise<PopularProductsResponse['data']> {
  try {
    console.log('正在獲取首頁熱門商品數據...');
    
    // 設置 API 請求超時控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超時
    
    // 使用 apiClient 呼叫 API
    // apiClient 的攔截器已經處理了回傳 response.data
    const response: ApiResponse<PopularProductsResponse['data']> = await apiClient.get(
      '/api/homepage?sectionName=popularProducts',
      { signal: controller.signal }
    );
    
    // 清除超時計時器
    clearTimeout(timeoutId);
    
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
