"use client"

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/useCartStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import FancyButton from "@/components/ui/FancyButton";
import { ArrowRight, ArrowRightCircle, ChevronUp, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

interface CartSummaryProps {
  appliedDiscount?: {
    code: string;
    type: string;
    value: number;
    discountAmount: number;
    description: string;
  } | null;
}

const CartSummary = ({ appliedDiscount }: CartSummaryProps) => {
  const router = useRouter();
  const { getSubtotal, getAddOnSubtotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 在組件內部計算運費和折扣
  const shippingFee = 60;
  const discount = Math.floor(appliedDiscount?.discountAmount || 0);
  const subtotal = getSubtotal();
  const addOnSubtotal = getAddOnSubtotal();
  const total = subtotal + addOnSubtotal + shippingFee - discount;
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.warning("請登入，才能進一步結帳", {
        duration: 3000,
      });
      return;
    }
    
    router.push("/cart/checkout");
  };
  
  return (
    <div className="lg:border lg:border-gray-200 lg:rounded-3xl p-4 lg:p-6 lg:bg-white lg:shadow-sm">
      {/* 手機版：應付金額和展開按鈕 */}
      <div className="lg:hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-600">應付金額</span>
            <span className="text-xl font-bold text-amber-600">
              <span className="font-jf-openhuninn">NT$ {total.toLocaleString('zh-TW')}</span>
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <span>付款明細</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* 手機版：可伸縮的明細區域 */}
        {isExpanded && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">小計</span>
                <span className="text-sm">
                  <span className="font-jf-openhuninn">NT$ {subtotal.toLocaleString('zh-TW')}</span>
                </span>
              </div>
              {addOnSubtotal > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">加購商品小計</span>
                  <span className="text-sm">
                    <span className="font-jf-openhuninn">NT$ {addOnSubtotal.toLocaleString('zh-TW')}</span>
                  </span>
                </div>
              )}
              {appliedDiscount && (
                <div className="flex justify-between items-center text-[#509D94]">
                  <span className="text-sm">折扣</span>
                  <span className="text-sm">
                    <span className="font-jf-openhuninn">NT$ {Math.floor(discount).toLocaleString('zh-TW')}</span>
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm">運費</span>
                <span className="text-sm">
                  <span className="font-jf-openhuninn">NT$ {shippingFee.toLocaleString('zh-TW')}</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 桌面版：原有的布局 */}
      <div className="hidden lg:block">
        <h2 className="text-xl font-medium text-teal-800 mb-4">總金額</h2>
        
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">商品小計</span>
            <span className="text-sm">
              <span className="font-jf-openhuninn">${subtotal.toLocaleString('zh-TW')}</span>
            </span>
          </div>
          {addOnSubtotal > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm">加購商品小計</span>
              <span className="text-sm">
                <span className="font-jf-openhuninn">${addOnSubtotal.toLocaleString('zh-TW')}</span>
              </span>
            </div>
          )}
          {appliedDiscount && (
            <div className="flex justify-between items-center text-[#509D94]">
              <span className="text-sm">折扣 ({appliedDiscount.code})</span>
              <span className="text-sm">
                <span className="font-jf-openhuninn">-${Math.floor(discount).toLocaleString('zh-TW')}</span>
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm">運費</span>
            <span className="text-sm">
              <span className="font-jf-openhuninn">${shippingFee.toLocaleString('zh-TW')}</span>
            </span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 my-4"></div>
        
        <div className="flex justify-between items-center mb-6">
          <span className="font-medium">應付金額</span>
          <span className="text-lg font-bold text-amber-600">
            <span className="font-jf-openhuninn">${total.toLocaleString('zh-TW')}</span>
          </span>
        </div>
      </div>
      
      <FancyButton 
        className="w-full text-base lg:text-lg" 
        hideIcons
        rightIcon={<ArrowRightCircle className="w-6 h-6 lg:w-8 lg:h-8" strokeWidth={2.5} />}
        onClick={handleCheckout}
      >
        前往結帳
      </FancyButton>
    </div>
  );
};

export default CartSummary;