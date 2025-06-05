'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/store/useCartStore';

export default function CartCleaner() {
  const { clearCart, clearAddOnItems } = useCartStore();
  
  // 付款成功後清空購物車
  useEffect(() => {
    // 清空一般商品
    clearCart();
    // 清空加購商品
    clearAddOnItems();
    console.log('付款成功，購物車已清空');
  }, [clearCart, clearAddOnItems]);

  // 這個組件不渲染任何內容，只執行副作用
  return null;
} 