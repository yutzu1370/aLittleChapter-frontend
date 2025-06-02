"use client"

import { useEffect, useState } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CartItem from "@/components/cart/CartItem"
import AddOnItem from "@/components/cart/AddOnItem"
import AddedOnItemsBlock from "@/components/cart/AddedOnItemsBlock"
import CartSummary from "@/components/cart/CartSummary"
import DiscountCode from "@/components/cart/DiscountCode"
import { useCartStore, useCartHydration, useLoadAddOns } from "@/lib/store/useCartStore"
import { useDiscountStore } from "@/lib/store/useDiscountStore"
import { Checkbox } from "@/components/ui/checkbox"

export default function CartPage() {
  const { items, addedOnItems, toggleSelectAll, getSubtotal, getAddOnSubtotal } = useCartStore();
  const isHydrated = useCartHydration();
  const { addOns, isLoadingAddOns } = useLoadAddOns();
  const [showAddedOnItems, setShowAddedOnItems] = useState(false);
  const { appliedDiscount } = useDiscountStore();
  
  const allSelected = items.every((item) => item.isSelected);

  // 計算購物車總金額（用於折扣碼驗證）
  const cartTotal = getSubtotal() + getAddOnSubtotal();

  // 當有加購商品時自動顯示已加購商品區塊
  useEffect(() => {
    if (addedOnItems.length > 0) {
      setShowAddedOnItems(true);
    }
  }, [addedOnItems.length]);

  const handleAddOnItemToCart = () => {
    setShowAddedOnItems(true);
  };

  const handleCloseAddedOnItems = () => {
    setShowAddedOnItems(false);
  };

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">載入中...</div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-teal-800 mb-8 text-center">購物車</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* 購物車商品列表 */}
            <div className="border border-gray-200 bg-white rounded-3xl p-6 mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-medium text-teal-800">購物車商品</h2>
              </div>

              {/* 表格標題列 */}
              {items.length > 0 && (
                <div className="flex items-center py-3 border-b border-gray-200 mb-4">
                  {/* 全選勾選框 */}
                  <div className="w-[40px]">
                    <Checkbox
                      id="select-all"
                      checked={allSelected}
                      onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                      className="h-5 w-5 border-amber-600 data-[state=checked]:bg-amber-600 data-[state=checked]:text-white"
                    />
                  </div>
                  
                  {/* 商品 */}
                  <div className="flex flex-1 items-center gap-4">
                    <span className="text-base font-medium text-gray-600">商品</span>
                  </div>

                  {/* 價格 */}
                  <div className="w-[110px]">
                    <span className="text-base font-medium text-gray-600">價格</span>
                  </div>

                  {/* 數量 */}
                  <div className="w-[120px] text-center">
                    <span className="text-base font-medium text-gray-600">數量</span>
                  </div>

                  {/* 小計 */}
                  <div className="w-[100px] text-right">
                    <span className="text-base font-medium text-gray-600">小計</span>
                  </div>
                </div>
              )}
              
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">購物車是空的</p>
                  <p className="text-gray-400 text-sm mt-2">快去挑選喜歡的商品吧！</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.productId} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* 已加購商品區塊 */}
            <AddedOnItemsBlock 
              isVisible={showAddedOnItems} 
              onClose={handleCloseAddedOnItems}
            />

            {/* 加購商品區塊 */}
            <div className="border border-gray-200 bg-white rounded-3xl p-6 mb-8 shadow-sm">
              <h2 className="text-3xl font-medium text-teal-800 mb-6">超級優惠加購價</h2>
              
              {isLoadingAddOns ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  <p className="text-gray-500 mt-2">載入加購商品中...</p>
                </div>
              ) : addOns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">暫無加購商品</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {addOns.map((item) => (
                    <AddOnItem 
                      key={item.productId} 
                      item={item} 
                      onAddToCart={handleAddOnItemToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* 總金額區塊 */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <DiscountCode 
                cartTotal={cartTotal}
              />
              <CartSummary appliedDiscount={appliedDiscount} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
