import axios from "axios";

// 關鍵字建議 API 回應格式
export interface KeywordSuggestionsResponse {
  status: boolean;
  data: string[];
}

// 獲取關鍵字建議
export async function getKeywordSuggestionsApi(keyword: string): Promise<string[]> {
 
  
  try {
   
    
    const response = await axios.post('https://35.187.144.53.nip.io/webhook/suggest-keyword', {
      keyword 
    });
    
   
    
    if (response.status === 200) {
     
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const firstItem = response.data[0]; // 取第一個物件
        if (firstItem.status && Array.isArray(firstItem.data)) {
         
          return firstItem.data;
        } else {
         
          return [];
        }
      } else {
       
        return [];
      }
    } else {
     
      return [];
    }
  } catch (error) {
   
    return [];
  }
}
