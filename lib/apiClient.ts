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

// 從 localStorage 獲取 token 的通用函數
const getTokenFromLocalStorage = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    const authData = JSON.parse(authStorage);
    return authData.state?.token || null;
  } catch (error) {
    console.error('從 localStorage 獲取 token 失敗:', error);
    return null;
  }
};

// 請求攔截器
apiClient.interceptors.request.use(
  (config) => {
    // 添加 token 到授權標頭
    const token = getTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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