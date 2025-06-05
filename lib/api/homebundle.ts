import apiClient from '@/lib/apiClient';
import { Book } from '@/lib/types/book';

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
    
    
    
    // 檢查回應結構
    if (response && typeof response === 'object') {
      // 檢查是否符合 { status: boolean, data: { books: Book[] } } 結構
      if ( response.data && Array.isArray(response.data.books)) {
        return response.data.books as Book[];
      }
      
      // 檢查是否符合 { data: { bundles: Book[] } } 結構
      if (response.data && Array.isArray(response.data.bundles)) {
        return response.data.bundles as Book[];
      }
      
      // 檢查是否直接返回陣列
      if (Array.isArray(response)) {
        return response as Book[];
      }
      
      // 檢查任何可能包含書籍陣列的屬性
      const responseObj = response as any;
      for (const key in responseObj) {
        if (Array.isArray(responseObj[key])) {
          // 檢查第一個元素是否像書籍
          const firstItem = responseObj[key][0];
          if (firstItem && typeof firstItem === 'object' && 'title' in firstItem) {
            console.log(`在 ${key} 屬性中找到書籍陣列`);
            return responseObj[key] as Book[];
          }
        } else if (typeof responseObj[key] === 'object' && responseObj[key] !== null) {
          // 檢查嵌套屬性
          for (const nestedKey in responseObj[key]) {
            if (Array.isArray(responseObj[key][nestedKey])) {
              const firstNestedItem = responseObj[key][nestedKey][0];
              if (firstNestedItem && typeof firstNestedItem === 'object' && 'title' in firstNestedItem) {
                console.log(`在 ${key}.${nestedKey} 屬性中找到書籍陣列`);
                return responseObj[key][nestedKey] as Book[];
              }
            }
          }
        }
      }
    }
    
    console.error('資料結構不符預期:', response);
    throw new Error('獲取套裝推薦失敗: 未找到有效的書籍資料');
  } catch (error) {
    console.error('獲取首頁套裝推薦資料失敗:', error);
    throw new Error('無法載入套裝推薦資料');
  }
};
