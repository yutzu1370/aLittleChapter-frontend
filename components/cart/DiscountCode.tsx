"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import FancyButton from "@/components/ui/FancyButton";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useDiscountStore, DiscountInfo } from "@/lib/store/useDiscountStore";
import { validateDiscountCodeApi } from "@/lib/api/discountCodes";

// 注意：現在使用真實的後端API驗證折扣碼

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
    
    try {
    

      // 呼叫後端API驗證折扣碼
      const result = await validateDiscountCodeApi(discountCode.trim(), {
        totalAmount: cartTotal
      });

      

      // 檢查回應結構
      if (!result) {
        
        toast.error("折扣碼驗證失敗");
        setIsApplying(false);
        return;
      }

      // 檢查 status 屬性
      if (!result.status) {
        
        toast.error(result.message || "折扣碼無效或已過期");
        setIsApplying(false);
        return;
      }

     

      // 根據 apiClient.ts 的攔截器，實際資料在 result.message 中
      // 但 message 可能是字串或物件，需要檢查
      let discountData;
      
      if (typeof result.message === 'object' && result.message !== null) {
        discountData = result.message;
      } else if (result.data && typeof result.data === 'object') {
        discountData = result.data;
      } else {
        
        toast.error("折扣碼驗證失敗");
        setIsApplying(false);
        return;
      }
      
      if (!discountData) {
        
        toast.error("折扣碼驗證失敗");
        setIsApplying(false);
        return;
      }

     

      // 計算實際折扣金額
      // 後端回傳的 discountAmount 就是計算後折扣金額需轉成int（例如：0.75 表示 75% 折扣）
      let actualDiscountAmount = 0;
      let discountValue = 0;

      if (discountData.discountType === 'percentage') {
        // 百分比折扣：後端回傳的是小數值（如 0.75），直接使用
        const discountAmount = parseInt(discountData.discountAmount.toString());
        // 折扣金額 = 購物車總額 × 折扣值，無條件捨去小數
        actualDiscountAmount = cartTotal - discountAmount
       
      } else if (discountData.discountType === 'fixed') {
        // 固定金額折扣
        discountValue = discountData.discountAmount;
        actualDiscountAmount = Math.min(discountData.discountAmount, cartTotal);
       
      }

      // 根據API回應建立折扣資訊
      const discountInfo: DiscountInfo = {
        code: discountData.discountCode,
        type: discountData.discountType,
        value: discountData.discountAmount,
        discountAmount: discountData.discountAmount,
        description: discountData.description
      };

     

      setDiscount(discountInfo);
      
      toast.success(`折扣碼套用成功！${discountData.description}`);
      setIsApplying(false);
    } catch (error) {
      
      toast.error("折扣碼驗證失敗，請稍後再試");
      setIsApplying(false);
    }
  };

  const handleRemoveDiscount = () => {
    clearDiscount();
    setDiscountCode("");
    toast.info("已移除折扣碼");
  };

  // 獲取當前的折扣金額
  const currentDiscountAmount = appliedDiscount ? calculateDiscountAmount(cartTotal) : 0;

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
                折扣金額: -${Math.floor(appliedDiscount.discountAmount)}
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
        </div>
      )}
    </div>
  );
};

export default DiscountCode; 