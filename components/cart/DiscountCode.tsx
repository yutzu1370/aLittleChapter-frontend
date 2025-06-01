"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import FancyButton from "@/components/ui/FancyButton";
import { toast } from "sonner";

const DiscountCode = () => {
  const [discountCode, setDiscountCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.warning("請輸入折扣碼");
      return;
    }

    setIsApplying(true);
    
    // 模擬API調用
    setTimeout(() => {
      // 這裡可以添加實際的折扣碼驗證邏輯
      toast.error("折扣碼無效或已過期");
      setIsApplying(false);
    }, 1000);
  };

  return (
    <div className="border border-gray-200 rounded-3xl p-6 bg-white shadow-sm mb-6">
      <h2 className="text-xl font-medium text-teal-800 mb-4">
        折扣碼
      </h2>
      
      <div className="flex gap-3">
        <Input
          type="text"
          placeholder="請輸入折扣碼"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          className="flex-1 rounded-full border-gray-300 placeholder:text-gray-400"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleApplyDiscount();
            }
          }}
        />
        <FancyButton 
          onClick={handleApplyDiscount}
          disabled={isApplying}
          className="px-6 text-base"
          hideIcons
        >
          {isApplying ? "驗證中..." : "套用"}
        </FancyButton>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        輸入有效的折扣碼以享受優惠
      </p>
    </div>
  );
};

export default DiscountCode; 