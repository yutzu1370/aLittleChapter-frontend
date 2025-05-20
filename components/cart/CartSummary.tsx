"use client"

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import FancyButton from "@/components/ui/FancyButton";
import { ArrowRight } from "lucide-react";

const CartSummary = () => {
  const { getSubtotal, getTotal, shippingFee, discount } = useCartStore();
  
  return (
    <div className="border border-gray-200 rounded-3xl p-6 bg-white shadow-sm">
      <h2 className="text-xl font-medium text-teal-800 mb-4">總金額</h2>
      
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">小計</span>
          <span className="text-sm">{formatPrice(getSubtotal())}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">折扣</span>
          <span className="text-sm">{formatPrice(discount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">運費</span>
          <span className="text-sm">{formatPrice(shippingFee)}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 my-4"></div>
      
      <div className="flex justify-between items-center mb-6">
        <span className="font-medium">應付金額</span>
        <span className="text-lg font-bold text-amber-600">{formatPrice(getTotal())}</span>
      </div>
      
      <FancyButton 
        className="w-full text-lg" 
        hideIcons
        rightIcon={<ArrowRight className="w-6 h-6" />}
      >
        前往結帳
      </FancyButton>
    </div>
  );
};

export default CartSummary; 