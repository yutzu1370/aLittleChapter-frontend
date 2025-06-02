import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '../types/product';
import { syncCartToBackendApi, CartItemRequest } from '../api/cart';
import { fetchAddOnItems, getRandomAddOnItems } from '../api/addOnItem';
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
  productId: number;
  name: string;
  price: number;
  addOnPrice: number; // 加購價格統一為price乘以0.5的價格
  imageUrl: string;
  quantity?: number; // 加購商品數量統一只能+1，可選屬性
}

interface CartStore {
  items: SimpleCartItem[];
  addedOnItems: AddOnItem[];
  addOns: AddOnItem[];
  isLoadingAddOns: boolean;
  
  // 商品相關操作
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleSelect: (productId: number) => void;
  toggleSelectAll: (selected: boolean) => void;
  clearCart: () => void;

  // 加購商品相關操作
  addOnItem: (addOnItem: AddOnItem, quantity?: number) => void;
  removeAddOnItem: (itemId: number) => void;
  updateAddOnQuantity: (itemId: number, quantity: number) => void;
  clearAddOnItems: () => void;
  loadAddOnsFromAPI: () => Promise<void>;

  // 計算
  getSubtotal: () => number;
  getTotal: () => number;
  getAddOnSubtotal: () => number;
  
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
      addedOnItems: [],
      addOns: [],
      isLoadingAddOns: false,

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

      // 加購商品相關操作
      addOnItem: (addOnItem, quantity = 1) => {
        console.log('正在加入加購商品:', addOnItem.name, 'x', quantity);
        set((state) => {
          const existingItem = state.addedOnItems.find(item => item.productId === addOnItem.productId);
          
          if (existingItem) {
            // 如果加購商品已存在，不允許重複加入（數量統一只能+1）
            console.log('加購商品已存在，不允許重複加入');
            return state;
          } else {
            // 新增加購商品，數量固定為1
            console.log('新增加購商品');
            const addedItem: AddOnItem = {
              ...addOnItem,
              quantity: 1 // 加購商品數量統一只能+1
            };
            
            return {
              ...state,
              addedOnItems: [...state.addedOnItems, addedItem]
            };
          }
        });
      },

      removeAddOnItem: (itemId) => {
        console.log('從購物車移除加購商品:', itemId);
        set((state) => ({
          ...state,
          addedOnItems: state.addedOnItems.filter(item => item.productId !== itemId)
        }));
      },

      updateAddOnQuantity: (itemId, quantity) => {
        console.log('更新加購商品數量:', itemId, quantity);
        set((state) => ({
          ...state,
          addedOnItems: state.addedOnItems.map(item => 
            item.productId === itemId ? { ...item, quantity } : item
          )
        }));
      },

      clearAddOnItems: () => {
        console.log('清空加購商品');
        set((state) => ({ ...state, addedOnItems: [] }));
      },

      // 從API加載加購商品
      loadAddOnsFromAPI: async () => {
        console.log('開始從API加載加購商品...');
        set((state) => ({ ...state, isLoadingAddOns: true }));
        
        try {
          // 獲取熱門商品（已轉換為加購商品格式）
          const addOnItems = await fetchAddOnItems();
          console.log('獲取到的加購商品:', addOnItems);
          
          // 隨機選取4個商品
          const selectedAddOns = getRandomAddOnItems(addOnItems, 4);
          console.log('隨機選取的加購商品:', selectedAddOns);
          
          set((state) => ({ 
            ...state, 
            addOns: selectedAddOns,
            isLoadingAddOns: false 
          }));
          
        } catch (error) {
          console.error('加載加購商品失敗:', error);
          // 如果API失敗，使用預設的加購商品
          const defaultAddOns: AddOnItem[] = [
            {
              productId: 3,
              name: '稻草人的微笑',
              price: 300,
              addOnPrice: 150,
              imageUrl: '/images/other/book_10-3.png'
            },
            {
              productId: 4,
              name: '音樂森林的秘密',
              price: 300,
              addOnPrice: 150,
              imageUrl: '/images/other/book_10-4.png'
            },
            {
              productId: 5,
              name: 'My Animal Friends',
              price: 300,
              addOnPrice: 150,
              imageUrl: '/images/other/book_10-1.png'
            },
            {
              productId: 6,
              name: '彩虹河的守護者',
              price: 300,
              addOnPrice: 150,
              imageUrl: '/images/other/book_10-2.png'
            }
          ];
          
          set((state) => ({ 
            ...state, 
            addOns: defaultAddOns,
            isLoadingAddOns: false 
          }));
        }
      },

      getSubtotal: () => {
        const { items } = get();
        return items
          .filter(item => item.isSelected)
          .reduce((total, item) => total + (item.discountPrice * item.quantity), 0);
      },

      getAddOnSubtotal: () => {
        const { addedOnItems } = get();
        return addedOnItems.reduce((total, item) => total + (item.addOnPrice * (item.quantity || 0)), 0);
      },

      getTotal: () => {
        const { getSubtotal, getAddOnSubtotal } = get();
        const subtotal = getSubtotal();
        const addOnSubtotal = getAddOnSubtotal();
        return subtotal + addOnSubtotal;
      },

      syncCartToBackend: async () => {
        const { items } = get();
        const cartItems: CartItemRequest[] = items.map(item => ({
          productId: item.productId,
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
      partialize: (state: CartStore) => ({ items: state.items, addedOnItems: state.addedOnItems }),
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

// Hook 用於自動加載加購商品
export const useLoadAddOns = () => {
  const { addOns, isLoadingAddOns, loadAddOnsFromAPI } = useCartStore();
  
  useEffect(() => {
    // 如果還沒有加購商品且不在加載中，則自動加載
    if (addOns.length === 0 && !isLoadingAddOns) {
      loadAddOnsFromAPI();
    }
  }, [addOns.length, isLoadingAddOns, loadAddOnsFromAPI]);
  
  return { addOns, isLoadingAddOns };
}; 