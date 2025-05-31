import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../types/product';
import { syncCartToBackendApi, CartItemRequest } from '../api/cart';
import { useState, useEffect } from 'react';

// 簡化的購物車項目類型 - 用於 localStorage 儲存
interface SimpleCartItem {
  productId: number;
  name: string;
  discountPrice: number;
  price: number;
  imageUrl: string;
  quantity: number;
  isSelected: boolean;
  stockQuantity: number;
}

// 加購商品類型
interface AddOnItem {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountPrice: number;
}

interface CartStore {
  items: SimpleCartItem[];
  addOns: AddOnItem[];
  
  // 商品相關操作
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleSelect: (productId: number) => void;
  toggleSelectAll: (selected: boolean) => void;
  clearCart: () => void;

  // 計算
  getSubtotal: () => number;
  getTotal: () => number;
  
  // 同步功能
  syncCartToBackend: () => Promise<boolean>;
}

// 檢查是否在客戶端以及 localStorage 是否可用的函數
const isLocalStorageAvailable = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    const testKey = '__cart_storage_test__';
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

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addOns: [
        {
          id: '3',
          name: '稻草人的微笑',
          image: '/images/other/book_10-3.png',
          originalPrice: 300,
          discountPrice: 199
        },
        {
          id: '4',
          name: '音樂森林的秘密',
          image: '/images/other/book_10-4.png',
          originalPrice: 300,
          discountPrice: 199
        },
        {
          id: '5',
          name: 'My Animal Friends',
          image: '/images/other/book_10-1.png',
          originalPrice: 300,
          discountPrice: 199
        },
        {
          id: '6',
          name: '彩虹河的守護者',
          image: '/images/other/book_10-2.png',
          originalPrice: 300,
          discountPrice: 199
        }
      ],

      addItem: (product, quantity = 1) => {
        console.log('正在加入商品到購物車:', product.name, 'x', quantity);
        const productId = parseInt(product.id);
        
        set((state) => {
          const existingItem = state.items.find(item => item.productId === productId);
          
          if (existingItem) {
            // 如果商品已存在，則增加數量
            console.log('商品已存在，增加數量');
            const newState = {
              ...state,
              items: state.items.map(item => 
                item.productId === productId 
                  ? { ...item, quantity: item.quantity + quantity } 
                  : item
              )
            };
            console.log('更新後的 state:', newState);
            return newState;
          } else {
            // 否則新增商品 - 轉換為簡化格式
            console.log('新增商品到購物車');
            const simpleItem: SimpleCartItem = {
              productId: productId,
              name: product.name,
              discountPrice: product.price,
              price: product.originalPrice,
              imageUrl: product.image,
              quantity,
              isSelected: true,
              stockQuantity: product.stockQuantity
            };
            
            const newState = {
              ...state,
              items: [...state.items, simpleItem]
            };
            console.log('新增後的 state:', newState);
            return newState;
          }
        });
      },

      removeItem: (productId) => {
        console.log('從購物車移除商品:', productId);
        set((state) => ({
          ...state,
          items: state.items.filter(item => item.productId !== productId)
        }));
      },

      updateQuantity: (productId, quantity) => {
        console.log('更新商品數量:', productId, quantity);
        set((state) => ({
          ...state,
          items: state.items.map(item => 
            item.productId === productId ? { ...item, quantity } : item
          )
        }));
      },

      toggleSelect: (productId) => {
        set((state) => ({
          ...state,
          items: state.items.map(item => 
            item.productId === productId ? { ...item, isSelected: !item.isSelected } : item
          )
        }));
      },

      toggleSelectAll: (selected) => {
        set((state) => ({
          ...state,
          items: state.items.map(item => ({ ...item, isSelected: selected }))
        }));
      },

      clearCart: () => {
        console.log('清空購物車');
        set((state) => ({ ...state, items: [] }));
      },

      getSubtotal: () => {
        const { items } = get();
        return items
          .filter(item => item.isSelected)
          .reduce((total, item) => total + (item.discountPrice * item.quantity), 0);
      },

      getTotal: () => {
        const { getSubtotal } = get();
        const subtotal = getSubtotal();
        return subtotal;
      },

      syncCartToBackend: async () => {
        const { items } = get();
        const cartItems: CartItemRequest[] = items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity
        }));

        try {
          const response = await syncCartToBackendApi(cartItems);
          console.log('購物車同步結果:', response);
          return response.status;
        } catch (error) {
          console.error('同步購物車到後端失敗:', error);
          return false;
        }
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: CartStore) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        console.log('購物車 hydration 完成:', state);
      },
    }
  )
);

// Hook 用於處理購物車的 hydration
export const useCartHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    // 確保在客戶端環境下才執行 rehydrate
    if (typeof window !== 'undefined') {
      useCartStore.persist.rehydrate();
      setIsHydrated(true);
    }
  }, []);
  
  return isHydrated;
}; 