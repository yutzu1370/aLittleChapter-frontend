"use client"

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/useCartStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import FancyButton from "@/components/ui/FancyButton";
import { ArrowRight, ArrowRightCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CartSummary = () => {
  const router = useRouter();
  const { getSubtotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  // 在組件內部計算運費和折扣
  const shippingFee = 60;
  const discount = 0;
  const subtotal = getSubtotal();
  const total = subtotal + shippingFee - discount;
  
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
    <div className="border border-gray-200 rounded-3xl p-6 bg-white shadow-sm">
      <h2 className="text-xl font-medium text-teal-800 mb-4">總金額</h2>
      
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">小計</span>
          <span className="text-sm">
            <span className="font-jf-openhuninn">${subtotal.toLocaleString('zh-TW')}</span>
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">折扣</span>
          <span className="text-sm">
            <span className="font-jf-openhuninn">${discount.toLocaleString('zh-TW')}</span>
          </span>
        </div>
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
      
      <FancyButton 
        className="w-full text-lg" 
        hideIcons
        rightIcon={<ArrowRightCircle className="w-8 h-8" strokeWidth={2.5} />}
        onClick={handleCheckout}
      >
        前往結帳
      </FancyButton>
    </div>
  );
};

export default CartSummary;