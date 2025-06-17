import apiClient, { ApiResponse } from '@/lib/apiClient';
import { BooksResponse } from '@/lib/types/book';

/**
 * 獲取首頁最新書籍資料
 * @returns Promise<BooksResponse['data']> 首頁最新書籍資料
 */
export const getHomeLatestProducts = async (): Promise<BooksResponse['data']> => {
  try {

    
    // 使用 apiClient 呼叫 API
    // apiClient 的攔截器已經處理了回傳 response.data
    const response: ApiResponse<BooksResponse['data']> = await apiClient.get(
      '/api/homepage', 
      {
        params: {
          sectionName: 'latestProducts'
        }
      }
    );
    
 
    
    if (!response.status || !response.data) {
      throw new Error(response.message || '獲取最新書籍失敗');
    }
    
    return response.data;
  } catch (error) {

    throw new Error('無法載入最新書籍資料');
  }
};
