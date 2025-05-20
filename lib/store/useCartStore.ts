import { create } from 'zustand';
import { CartItem, AddOnItem } from '../types/cart';
import { Product } from '../types/product';

interface CartStore {
  items: CartItem[];
  addOns: AddOnItem[];
  shippingFee: number;
  discount: number;
  
  // 商品相關操作
  addItem: (product: Product) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleSelect: (itemId: string) => void;
  toggleSelectAll: (selected: boolean) => void;

  // 計算
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [
    {
      id: '1',
      product: {
        id: '1',
        name: '料理小天才',
        description: '',
        price: 288,
        originalPrice: 588,
        image: '/images/other/book_09-1.png'
      },
      quantity: 2,
      isSelected: true
    },
    {
      id: '2',
      product: {
        id: '2',
        name: '宇宙探險家',
        description: '',
        price: 388,
        originalPrice: 688,
        image: '/images/other/book_09-2.png'
      },
      quantity: 2,
      isSelected: true
    }
  ],
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

  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // 如果商品已存在，則增加數量
        return {
          items: state.items.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        };
      } else {
        // 否則新增商品
        return {
          items: [...state.items, { 
            id: product.id, 
            product, 
            quantity: 1,
            isSelected: true
          }]
        };
      }
    });
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== itemId)
    }));
  },

  updateQuantity: (itemId, quantity) => {
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
})); 