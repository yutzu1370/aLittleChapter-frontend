import apiClient, { ApiResponse } from '@/lib/apiClient';

// 定義套裝推薦資料介面
export interface Bundle {
  id: string;
  title: string;
  imageUrl: string;
  introductionHtml: string;
}

// 定義首頁套裝推薦資料介面
export interface HomeBundleRecommendations {
  title: string;
  bundles: Bundle[];
}

/**
 * 獲取首頁套裝推薦資料
 * @returns Promise<ApiResponse<HomeBundleRecommendations>> 首頁套裝推薦資料
 */
export const getHomeBundleRecommendations = async (): Promise<ApiResponse<HomeBundleRecommendations>> => {
  try {
    // apiClient 的回應攔截器已經處理了 response.data，所以這裡直接使用回傳值
    const response = await apiClient.get<never, ApiResponse<HomeBundleRecommendations>>('/api/homepage', {
      params: {
        sectionName: 'bundleRecommendations'
      }
    });
    
    return response;
  } catch (error) {
    console.error('獲取首頁套裝推薦資料失敗:', error);
    return {
      status: false,
      message: '獲取資料失敗',
      data: undefined
    };
  }
};
