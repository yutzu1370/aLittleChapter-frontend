import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL;

// 定義 API 回應的通用介面
export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data?: T;
}

// 建立 axios 實例
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器
apiClient.interceptors.request.use(
  (config) => {
    // 在這裡可以添加通用請求配置，例如認證 token
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 回應攔截器
apiClient.interceptors.response.use(
  (response) => {
    // 直接返回後端的回應資料
    return response.data;
  },
  (error) => {
    // 如果後端有回傳錯誤資訊，直接返回後端回應
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return error;
  }
);

export default apiClient; 