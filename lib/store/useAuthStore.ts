import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name?: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// 檢查 localStorage 是否可用的函數
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.error('localStorage 不可用:', e);
    return false;
  }
};

// 初始化時輸出偵錯信息
console.log('localStorage 可用:', isLocalStorageAvailable());

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: (user) => {
        console.log('正在儲存使用者資訊到 store:', user);
        set({
          user,
          isAuthenticated: true,
          token: user.token,
        });
        
      },
      logout: () => {
        console.log('登出中...');
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        });
      },
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
    }),
    {
      name: 'auth-storage', // localStorage 的金鑰名稱
      storage: createJSONStorage(() => {
        return isLocalStorageAvailable() ? localStorage : {
          getItem: () => null,
          setItem: () => null,
          removeItem: () => null,
        };
      }),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
); 