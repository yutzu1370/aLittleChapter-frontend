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
}

export async function updateUserProfile(data: UpdateProfileData): Promise<ApiResponse> {
  return apiClient.put('/api/users/profile', data);
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