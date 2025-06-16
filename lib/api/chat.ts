import apiClient, { ApiResponse } from "@/lib/apiClient";

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  message: string;
  timestamp?: string;
}

// 發送聊天訊息
export async function sendChatMessage(message: string): Promise<ApiResponse<ChatResponse>> {
  console.log('🔍 [Chat API] 發送訊息:', { message });
  
  try {
    const response: ApiResponse<ChatResponse> = await apiClient.post('/api/chat', { message });
    console.log('✅ [Chat API] 回應資料:', response);
    return response;
  } catch (error) {
    console.error('❌ [Chat API] 請求失敗:', error);
    throw error;
  }
}
