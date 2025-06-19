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
    <main className="min-h-screen bg-white font-noto-sans-tc">
      <Header />
      
      {/* 手機版：主要內容區域，底部留空間給固定的總金額區塊 */}
      <div className="lg:container lg:mx-auto px-4 pt-28 lg:pt-32 pb-4 lg:pb-8">
        {/* 手機版：單列布局 / 桌面版：雙列布局 */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          
          {/* 購物車內容區域 */}
          <div className="lg:col-span-2  lg:pb-0">
            {/* 購物車商品列表 */}
            <div className="border border-gray-200 bg-white rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h1 className="text-2xl lg:text-3xl font-medium text-teal-800">購物車</h1>
              </div>

              {/* 桌面版表格標題列 - 手機版隱藏 */}
              {items.length > 0 && (
                <div className="hidden lg:flex items-center py-3 border-b border-gray-200 mb-4">
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

              {/* 手機版全選區塊 */}
              {items.length > 0 && (
                <div className="lg:hidden flex items-center py-3 border-b border-gray-200 mb-4">
                  <Checkbox
                    id="select-all-mobile"
                    checked={allSelected}
                    onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                    className="h-5 w-5 border-amber-600 data-[state=checked]:bg-amber-600 data-[state=checked]:text-white mr-3"
                  />
                  <label htmlFor="select-all-mobile" className="text-base font-medium text-gray-600">
                    全選
                  </label>
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
            <div className="border border-gray-200 bg-white rounded-3xl p-4 lg:p-6 mb-6 lg:mb-8 shadow-sm">
              <h2 className="text-2xl lg:text-3xl font-medium text-teal-800 mb-4 lg:mb-6">超級優惠加購價</h2>
              
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
          
          {/* 桌面版總金額區塊 */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              {/* 折扣碼區塊 */}
              <DiscountCode 
                cartTotal={cartTotal}
              />
              {/* 總金額區塊 */}
              <CartSummary appliedDiscount={appliedDiscount} />
            </div>
          </div>
        </div>
      </div>

      {/* 手機版固定在底部的總金額區塊 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg rounded-t-3xl">
        {/* 總金額區塊 */}
        <div className="px-4 py-4">
          {/* 折扣碼輸入區 - 簡化版 */}
          <div className="mb-4">
            <DiscountCode 
              cartTotal={cartTotal}
            />
          </div>
          
          {/* 總金額摘要 */}
          <CartSummary appliedDiscount={appliedDiscount} />
        </div>
      </div>

      {/* 桌面版 Footer */}
      <div className="hidden lg:block">
        <Footer />
      </div>
      
      {/* 手機版 Footer - 在固定總金額區塊上方 */}
      <div className="lg:hidden">
        <Footer />
      </div>
    </main>
  )
}
