import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface DiscountInfo {
  code: string;
  type: string;
  value: number;
  discountAmount: number;
  description: string;
}

interface DiscountStore {
  appliedDiscount: DiscountInfo | null;
  setDiscount: (discount: DiscountInfo | null) => void;
  clearDiscount: () => void;
  clearDiscountOnPaymentSuccess: () => void;
  calculateDiscountAmount: (cartTotal: number) => number;
}

export const useDiscountStore = create<DiscountStore>()(
  persist(
    (set, get) => ({
      appliedDiscount: null,

      setDiscount: (discount) => {
        set({ appliedDiscount: discount });
      },

      clearDiscount: () => {
        set({ appliedDiscount: null });
      },

      clearDiscountOnPaymentSuccess: () => {
        set({ appliedDiscount: null });
        console.log('付款成功，折扣碼已清空');
      },

      calculateDiscountAmount: (cartTotal) => {
        const { appliedDiscount } = get();
        if (!appliedDiscount) return 0;

        let discountAmount = 0;
        if (appliedDiscount.type === 'fixed') {
          discountAmount = Math.min(appliedDiscount.value, cartTotal);
        } else if (appliedDiscount.type === 'percentage') {
          discountAmount = cartTotal * appliedDiscount.value;
        }
        
        // 無條件捨去小數點並返回整數
        return Math.floor(discountAmount);
      }
    }),
    {
      name: 'discount-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 