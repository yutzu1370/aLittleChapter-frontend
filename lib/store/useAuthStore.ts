"use client"

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: User) => Promise<void>;
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
      login: async (user) => {
        console.log('正在儲存使用者資訊到 store:', user);
        
        // 先設置登入狀態
        set({
          user,
          isAuthenticated: true,
          token: user.token,
        });
        
        // 登入成功後同步購物車
        try {
          // 動態導入 useCartStore 以避免循環依賴
          const { useCartStore } = await import('./useCartStore');
          const cartStore = useCartStore.getState();
          
          // 檢查是否有購物車項目需要同步
          if (cartStore.items.length > 0) {
            console.log('開始同步訪客購物車到後端...');
            const syncSuccess = await cartStore.syncCartToBackend();
            
            if (syncSuccess) {
              console.log('購物車同步成功');
              // 同步成功後可以選擇清空本地購物車，或保留讓用戶決定
              // cartStore.clearCart();
            } else {
              console.error('購物車同步失敗');
            }
          }
        } catch (error) {
          console.error('購物車同步過程中發生錯誤:', error);
        }
      },
      logout: () => {
        console.log('登出中...');
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        });
      },
      updateUser: (userData) => {
        console.log('正在更新使用者資訊:', userData);
        set((state) => {
          // 確保用戶存在
          if (!state.user) return state;
          
          // 更新用戶資訊
          const updatedUser = { ...state.user, ...userData };
          
          return {
            user: updatedUser,
            isAuthenticated: true,
            token: updatedUser.token || state.token,
          };
        });
      },
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