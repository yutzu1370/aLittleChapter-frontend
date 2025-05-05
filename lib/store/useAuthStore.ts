"use client"

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

// 檢查是否在客戶端以及 localStorage 是否可用的函數
const isLocalStorageAvailable = () => {
  // 檢查是否在瀏覽器環境中
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.error('localStorage 不可用:', e);
    return false;
  }
};

// 客戶端 hydration 時才執行
const isBrowser = typeof window !== 'undefined';
if (isBrowser) {
  console.log('localStorage 可用:', isLocalStorageAvailable());
}

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
        // 使用安全的存儲方式，檢查是否在客戶端環境
        if (isBrowser && isLocalStorageAvailable()) {
          return localStorage;
        }
        // 服務端渲染時提供空的存儲實現
        return {
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