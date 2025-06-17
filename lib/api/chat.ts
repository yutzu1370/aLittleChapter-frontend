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

  
  try {
    const response: ApiResponse<ChatResponse> = await apiClient.post('/api/chat', { message });

    return response;
  } catch (error) {

    throw error;
  }
}
