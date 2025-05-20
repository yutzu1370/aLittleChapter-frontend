"use client"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CartItem from "@/components/cart/CartItem"
import AddOnItem from "@/components/cart/AddOnItem"
import CartSummary from "@/components/cart/CartSummary"
import { useCartStore } from "@/lib/store/useCartStore"
import { Checkbox } from "@/components/ui/checkbox"
import { CartItem as CartItemType, AddOnItem as AddOnItemType } from "@/lib/types/cart"

export default function CartPage() {
  const { items, addOns, toggleSelectAll } = useCartStore();
  const allSelected = items.every((item: CartItemType) => item.isSelected);

  return (
    <main className="min-h-screen bg-orange-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 購物車區塊 */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm">
              <h1 className="text-3xl font-medium text-teal-800 mb-6">購物車</h1>
              
              {/* 表頭 */}
              <div className="flex items-center py-3 border-b border-gray-200">
                <div className="w-[40px] flex items-center ">
                  <Checkbox 
                    checked={allSelected}
                    onCheckedChange={(checked) => toggleSelectAll(!!checked)}
                    className="h-5 w-5 border-amber-600 data-[state=checked]:bg-amber-600 data-[state=checked]:text-white"
                  />
                </div>
                <div className="flex-1 font-semibold text-gray-600">商品</div>
                <div className="w-[110px] font-semibold text-gray-600">價格</div>
                <div className="w-[120px] text-center font-semibold text-gray-600">數量</div>
                <div className="w-[100px] text-right font-semibold text-gray-600">小計</div>
              </div>
              
              {/* 購物車商品列表 */}
              <div>
                {items.map((item: CartItemType) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          
            {/* 加購商品區塊 */}
            <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm">
              <h2 className="text-3xl font-medium text-teal-800 mb-6">超級優惠加購價</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {addOns.map((item: AddOnItemType) => (
                  <AddOnItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
          
          {/* 總金額區塊 */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
