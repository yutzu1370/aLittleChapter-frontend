import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, AddOnItem } from '../types/cart';
import { Product } from '../types/product';

interface CartStore {
  items: CartItem[];
  addOns: AddOnItem[];
  shippingFee: number;
  discount: number;
  
  // 商品相關操作
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleSelect: (itemId: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  clearCart: () => void;

  // 計算
  getSubtotal: () => number;
  getTotal: () => number;
}

// 檢查是否在客戶端以及 localStorage 是否可用的函數
const isLocalStorageAvailable = () => {
  // 檢查是否在瀏覽器環境中
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
      shippingFee: 60,
      discount: 0,

      addItem: (product, quantity = 1) => {
        console.log('正在加入商品到購物車:', product.name, 'x', quantity);
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id);
          
          if (existingItem) {
            // 如果商品已存在，則增加數量
            console.log('商品已存在，增加數量');
            return {
              items: state.items.map(item => 
                item.product.id === product.id 
                  ? { ...item, quantity: item.quantity + quantity } 
                  : item
              )
            };
          } else {
            // 否則新增商品
            console.log('新增商品到購物車');
            return {
              items: [...state.items, { 
                id: product.id, 
                product, 
                quantity,
                isSelected: true
              }]
            };
          }
        });
      },

      removeItem: (itemId) => {
        console.log('從購物車移除商品:', itemId);
        set((state) => ({
          items: state.items.filter(item => item.id !== itemId)
        }));
      },

      updateQuantity: (itemId, quantity) => {
        console.log('更新商品數量:', itemId, quantity);
        set((state) => ({
          items: state.items.map(item => 
            item.id === itemId ? { ...item, quantity } : item
          )
        }));
      },

      toggleSelect: (itemId) => {
        set((state) => ({
          items: state.items.map(item => 
            item.id === itemId ? { ...item, isSelected: !item.isSelected } : item
          )
        }));
      },

      toggleSelectAll: (selected) => {
        set((state) => ({
          items: state.items.map(item => ({ ...item, isSelected: selected }))
        }));
      },

      clearCart: () => {
        console.log('清空購物車');
        set({ items: [] });
      },

      getSubtotal: () => {
        const { items } = get();
        return items
          .filter(item => item.isSelected)
          .reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },

      getTotal: () => {
        const { getSubtotal, shippingFee, discount } = get();
        return getSubtotal() + shippingFee - discount;
      }
    }),
    {
      name: 'cart-storage', // localStorage 的金鑰名稱
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
        items: state.items,
        shippingFee: state.shippingFee,
        discount: state.discount,
      }),
    }
  )
); 