import apiClient, { ApiResponse } from "@/lib/apiClient";

// 折扣碼驗證資料介面
export interface DiscountCodeData {
  totalAmount: number; // 訂單總金額(不含運費、折扣金額)
}

// 折扣碼回應資料介面
export interface DiscountCodeResponse {
  discountCode: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountAmount: number;
}

// 驗證折扣碼
export async function validateDiscountCodeApi(code: string, data: DiscountCodeData): Promise<ApiResponse<DiscountCodeResponse>> {
  return apiClient.post(`/api/discountCodes/${code}`, data);
}

// 折扣碼資料介面
export interface DiscountCode {
  id: number;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isUsed: boolean;
}

// 獲取折扣碼列表
export async function getDiscountCodesApi(): Promise<ApiResponse<DiscountCode[]>> {
  return apiClient.get('/api/discountCodes');
} 