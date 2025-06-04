import apiClient, { ApiResponse } from '@/lib/apiClient';

// 定義書籍資料介面，所有非關鍵欄位都標記為可選
export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  imageUrl: string;
  ageRangeName: string;
  categoryName: string;
  introductionHtml?: string;
  price?: number;
  discountPrice?: number | null;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isDiscount?: boolean;
}

// 定義首頁最新書籍資料介面
export interface HomeLatestProducts {
  title: string;
  books: Book[];
}

/**
 * 獲取首頁最新書籍資料
 * @returns Promise<ApiResponse<HomeLatestProducts>> 首頁最新書籍資料
 */
export const getHomeLatestProducts = async (): Promise<ApiResponse<HomeLatestProducts>> => {
  try {
    // apiClient 的回應攔截器已經處理了 response.data，所以這裡直接使用回傳值
    const response = await apiClient.get<never, ApiResponse<HomeLatestProducts>>('/api/homepage', {
      params: {
        sectionName: 'latestProducts'
      }
    });
    console.log('API 回應:', response); // 添加日誌以幫助調試
    return response;
  } catch (error) {
    console.error('獲取首頁最新書籍資料失敗:', error);
    return {
      status: false,
      message: '獲取資料失敗',
      data: undefined
    };
  }
};
