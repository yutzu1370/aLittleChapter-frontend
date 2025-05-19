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

// 上傳頭像相關功能 (如果需要)
export async function uploadAvatar(file: File): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append("avatar", file);
  
  return apiClient.post('/api/users/upload-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
} 