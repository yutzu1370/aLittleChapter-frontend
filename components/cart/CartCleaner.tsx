'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useDiscountStore } from '@/lib/store/useDiscountStore';

export default function CartCleaner() {
  const { clearCart, clearAddOnItems } = useCartStore();
  const { clearDiscountOnPaymentSuccess } = useDiscountStore();
  
  // 付款成功後清空購物車和折扣碼
  useEffect(() => {
    // 清空一般商品
    clearCart();
    // 清空加購商品
    clearAddOnItems();
    // 清空折扣碼
    clearDiscountOnPaymentSuccess();
    
  }, [clearCart, clearAddOnItems, clearDiscountOnPaymentSuccess]);

  // 這個組件不渲染任何內容，只執行副作用
  return null;
} 