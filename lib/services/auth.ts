import axios from 'axios';

// 使用環境變數，從 .env.local 檔案中取得
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 檢查環境變數是否存在
if (!API_BASE_URL) {
  console.warn('警告: NEXT_PUBLIC_API_BASE_URL 環境變數未設定，請確認 .env.local 檔案存在且正確設定');
}

const API_ROUTES = {
  LOGIN: `${API_BASE_URL}/api/users/log-in`,
  REGISTER: `${API_BASE_URL}/api/users/sign-up`
};

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  id: string;
  email: string;
  name?: string;
  token: string;
}

/**
 * 使用者登入
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    // 由於我們是模擬登入，如果是 admin/password 直接返回成功
    if (credentials.email === 'admin' && credentials.password === 'password') {
      // 模擬成功的 API 回應
      return {
        id: '1',
        email: 'admin',
        name: '管理者',
        token: `token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      };
    }

    // 檢查 API URL 是否有效
    if (!API_BASE_URL) {
      throw new Error('API 基礎 URL 未設定，請檢查環境變數設定');
    }

    // 真實環境中使用 API
    const response = await axios.post<ApiResponse<LoginResponse>>(API_ROUTES.LOGIN, credentials);
    
    if (response.status === 200 && response.data.status) {
      return response.data.data as LoginResponse;
    }
    
    throw new Error(response.data.message || '登入失敗');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || '登入失敗';
      
      if (status === 400) {
        throw new Error('請檢查您的帳號和密碼格式');
      } else if (status === 401) {
        throw new Error('帳號或密碼錯誤');
      } else if (status === 500) {
        throw new Error('系統錯誤，請稍後再試');
      }
      
      throw new Error(message);
    }
    
    throw error;
  }
};

/**
 * 使用者註冊
 */
export const register = async (credentials: RegisterCredentials): Promise<ApiResponse> => {
  try {
    // 檢查 API URL 是否有效
    if (!API_BASE_URL) {
      throw new Error('API 基礎 URL 未設定，請檢查環境變數設定');
    }
    
    // 實際環境中使用 API
    const response = await axios.post<ApiResponse>(API_ROUTES.REGISTER, credentials);
    
    if (response.status === 201 && response.data.status) {
      return response.data;
    }
    
    throw new Error(response.data.message || '註冊失敗');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || '註冊失敗';
      
      if (status === 400) {
        throw new Error('請檢查您的註冊資料格式');
      } else if (status === 409) {
        throw new Error('此帳號已被註冊');
      } else if (status === 500) {
        throw new Error('系統錯誤，請稍後再試');
      }
      
      throw new Error(message);
    }
    
    throw error;
  }
}; 