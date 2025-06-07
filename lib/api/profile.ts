import apiClient, { ApiResponse } from "@/lib/apiClient";

// 獲取用戶資料
export async function getUserProfile(): Promise<ApiResponse> {
  return apiClient.get('/api/users/profile');
}

// 更新用戶資料
export interface UpdateProfileData {
  name: string;
  gender: string;
  phone: string;
  birthDate: string;
  address: string;
  avatar: string;
}

export async function updateUserProfile(data: UpdateProfileData): Promise<ApiResponse> {
  return apiClient.put('/api/users/profile', data);
}

// Email 修改相關 API

// 第一步：發送 email 修改請求
export interface EmailChangeRequest {
  newEmail: string;
}

export async function requestEmailChange(data: EmailChangeRequest): Promise<ApiResponse> {
  return apiClient.post('/api/users/email-change', data);
}

// 第二步：驗證 email 修改
export interface EmailChangeVerification {
  newEmail: string;
  newEmailCode: string;
}

export async function verifyEmailChange(data: EmailChangeVerification): Promise<ApiResponse> {
  return apiClient.post('/api/users/email-change/verify', data);
}

// 上傳頭像回應資料類型
export interface UploadAvatarResponse {
  avatar: string;
}

// 上傳頭像功能
export async function uploadAvatar(file: File): Promise<ApiResponse<UploadAvatarResponse>> {
  const formData = new FormData();
  formData.append("avatar", file);
  
  return apiClient.post('/api/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
} 