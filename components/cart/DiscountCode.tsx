"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import FancyButton from "@/components/ui/FancyButton";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useDiscountStore, DiscountInfo } from "@/lib/store/useDiscountStore";

// 折扣碼假資料
const DISCOUNT_CODES = [
  {
    code: 'MOMSDAY2025',
    discount_type: 'fixed',
    discount_value: 150.00,
    min_amount: 500,
    description: '滿500折150'
  },
  {
    code: 'KIDSFEST25',
    discount_type: 'percentage',
    discount_value: 0.25,
    min_amount: 0,
    description: '總金額75折'
  }
];

interface DiscountCodeProps {
  cartTotal?: number;
}

const DiscountCode = ({ cartTotal = 0 }: DiscountCodeProps) => {
  const [discountCode, setDiscountCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const { appliedDiscount, setDiscount, clearDiscount, calculateDiscountAmount } = useDiscountStore();

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.warning("請輸入折扣碼");
      return;
    }

    setIsApplying(true);
    
    // 模擬API調用
    setTimeout(() => {
      const foundDiscount = DISCOUNT_CODES.find(
        discount => discount.code.toLowerCase() === discountCode.toLowerCase()
      );

      if (!foundDiscount) {
        toast.error("折扣碼無效或已過期");
        setIsApplying(false);
        return;
      }

      // 檢查最低消費金額
      if (cartTotal < foundDiscount.min_amount) {
        toast.error(`此折扣碼需滿 $${foundDiscount.min_amount} 才能使用`);
        setIsApplying(false);
        return;
      }

      // 計算折扣金額
      let discountAmount = 0;
      if (foundDiscount.discount_type === 'fixed') {
        discountAmount = Math.min(foundDiscount.discount_value, cartTotal);
      } else if (foundDiscount.discount_type === 'percentage') {
        discountAmount = cartTotal * foundDiscount.discount_value;
      }
      
      const discountInfo: DiscountInfo = {
        code: foundDiscount.code,
        type: foundDiscount.discount_type,
        value: foundDiscount.discount_value,
        discountAmount: Math.floor(discountAmount),
        description: foundDiscount.description
      };

      setDiscount(discountInfo);
      
      toast.success(`折扣碼套用成功！${foundDiscount.description}`);
      setIsApplying(false);
    }, 1000);
  };

  const handleRemoveDiscount = () => {
    clearDiscount();
    setDiscountCode("");
    toast.info("已移除折扣碼");
  };

  return (
    <div className="border border-gray-200 rounded-3xl p-6 bg-white shadow-sm mb-6">
      <h2 className="text-xl font-medium text-[#295C58] mb-4">
        折扣碼
      </h2>
      
      {appliedDiscount ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#F3FAF8] rounded-2xl ">
            <div>
              <p className="font-medium text-[#295C58]">{appliedDiscount.code}</p>
              <p className="text-sm text-[#509D94]">{appliedDiscount.description}</p>
              <p className="text-sm text-[#509D94]">
                折扣金額: -${appliedDiscount.discountAmount.toFixed(2)}
              </p>
            </div>
            <FancyButton
              onClick={handleRemoveDiscount}
              variant="ghost"
              size="sm"
              className="rounded-full hover:bg-[#B1DED6] active:bg-[#82C6BD] transition-all duration-200 active:scale-95 w-12 h-12 p-0"
              hideIcons
            >
              <X className="h-6 w-6" strokeWidth={5} />
            </FancyButton>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
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
          
          <p className="text-xs text-gray-500">
            輸入有效的折扣碼以享受優惠
          </p>
          
          {/* 顯示可用的折扣碼提示 */}
          <div className="text-xs text-gray-400 space-y-1">
            <p>可用折扣碼：</p>
            <p>• MOMSDAY2025 - 滿500折150</p>
            <p>• KIDSFEST25 - 總金額75折</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCode; 