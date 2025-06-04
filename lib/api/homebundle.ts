import apiClient from '@/lib/apiClient';
import { Book} from '@/lib/types/book';

/**
 * 獲取首頁套裝推薦資料
 * @returns Promise<Book[]> 首頁套裝推薦資料
 */
export const getHomeBundleRecommendations = async (): Promise<Book[]> => {
  try {
    console.log('正在獲取首頁套裝推薦資料...');
    
    // 使用 apiClient 呼叫 API
    const response = await apiClient.get(
      '/api/homepage', 
      {
        params: {
          sectionName: 'bundleRecommendations'
        }
      }
    );
    
    // 使用 as any 類型斷言處理資料
    const anyResponse = response as any;
    
    // 確認資料結構為 data.bundles
    if (anyResponse.data && Array.isArray(anyResponse.data.bundles)) {
      return anyResponse.data.bundles as Book[];
    }
    
    throw new Error('獲取套裝推薦失敗: 未找到有效的書籍資料');
  } catch (error) {
    console.error('獲取首頁套裝推薦資料失敗:', error);
    throw new Error('無法載入套裝推薦資料');
  }
};
