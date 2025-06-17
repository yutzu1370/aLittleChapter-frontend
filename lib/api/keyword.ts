import axios from "axios";

// 關鍵字建議 API 回應格式
export interface KeywordSuggestionsResponse {
  status: boolean;
  data: string[];
}

// 獲取關鍵字建議
export async function getKeywordSuggestionsApi(keyword: string): Promise<string[]> {
  console.log('🔍 [Keyword API] 開始搜尋建議，關鍵字:', keyword);
  
  try {
    console.log('📡 [Keyword API] 準備發送請求到:', 'https://35.187.144.53.nip.io/webhook/suggest-keyword');
    console.log('📦 [Keyword API] 請求參數:', { keyword });
    
    const response = await axios.post('https://35.187.144.53.nip.io/webhook/suggest-keyword', {
      keyword 
    });
    
    console.log('📡 [Keyword API] HTTP 狀態碼:', response.status);
    console.log('📦 [Keyword API] 完整回應物件:', response);
    console.log('📦 [Keyword API] 回應資料:', response.data);
    
    if (response.status === 200) {
      console.log('✅ [Keyword API] HTTP 200 成功');
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const firstItem = response.data[0]; // 取第一個物件
        if (firstItem.status && Array.isArray(firstItem.data)) {
          console.log('✅ [Keyword API] 找到建議陣列:', firstItem.data);
          console.log('📝 [Keyword API] 建議數量:', firstItem.data.length);
          return firstItem.data;
        } else {
          console.log('❌ [Keyword API] data 不是陣列或不存在');
          return [];
        }
      } else {
        console.log('❌ [Keyword API] API status 為 false 或不存在');
        return [];
      }
    } else {
      console.log('❌ [Keyword API] HTTP 狀態碼不是 200:', response.status);
      return [];
    }
  } catch (error) {
    console.error('❌ [Keyword API] 獲取搜尋建議失敗:', error);
    if (error instanceof Error) {
      console.error('❌ [Keyword API] 錯誤詳情:', error.message);
      console.error('❌ [Keyword API] 錯誤堆疊:', error.stack);
    }
    if (axios.isAxiosError(error)) {
      console.error('❌ [Keyword API] Axios 錯誤回應:', error.response?.data);
      console.error('❌ [Keyword API] Axios 錯誤狀態:', error.response?.status);
    }
    return [];
  }
}
