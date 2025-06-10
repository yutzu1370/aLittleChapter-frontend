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
      console.log('🚀 [DiscountCode] 開始驗證折扣碼:', {
        code: discountCode.trim(),
        totalAmount: cartTotal
      });

      // 呼叫後端API驗證折扣碼
      const result = await validateDiscountCodeApi(discountCode.trim(), {
        totalAmount: cartTotal
      });

      console.log('📦 [DiscountCode] API 完整回應:', result);
      console.log('🔍 [DiscountCode] API 回應類型:', typeof result);
      console.log('🔍 [DiscountCode] API 回應 keys:', Object.keys(result || {}));

      // 檢查回應結構
      if (!result) {
        console.log('❌ [DiscountCode] API 回應為空');
        toast.error("折扣碼驗證失敗");
        setIsApplying(false);
        return;
      }

      // 檢查 status 屬性
      if (!result.status) {
        console.log('❌ [DiscountCode] API 回應 status 為 false:', result.message);
        toast.error(result.message || "折扣碼無效或已過期");
        setIsApplying(false);
        return;
      }

      console.log('✅ [DiscountCode] API 回應 status 為 true，檢查 message 物件:', result.message);

      // 根據 apiClient.ts 的攔截器，實際資料在 result.message 中
      // 但 message 可能是字串或物件，需要檢查
      let discountData;
      
      if (typeof result.message === 'object' && result.message !== null) {
        discountData = result.message;
      } else if (result.data && typeof result.data === 'object') {
        discountData = result.data;
      } else {
        console.log('❌ [DiscountCode] 無法解析折扣碼資料，message:', result.message, 'data:', result.data);
        toast.error("折扣碼驗證失敗");
        setIsApplying(false);
        return;
      }
      
      if (!discountData) {
        console.log('❌ [DiscountCode] 折扣碼資料為空');
        toast.error("折扣碼驗證失敗");
        setIsApplying(false);
        return;
      }

      console.log('📋 [DiscountCode] 折扣碼資料:', {
        discountCode: discountData.discountCode,
        discountType: discountData.discountType,
        discountAmount: discountData.discountAmount,
        description: discountData.description
      });

      // 根據API回應建立折扣資訊
      const discountInfo: DiscountInfo = {
        code: discountData.discountCode,
        type: discountData.discountType,
        value: discountData.discountType === 'percentage' 
          ? discountData.discountAmount / cartTotal  // 將百分比轉換為小數
          : discountData.discountAmount,
        discountAmount: discountData.discountAmount,
        description: discountData.description
      };

      console.log('💡 [DiscountCode] 建立的折扣資訊:', discountInfo);

      setDiscount(discountInfo);
      
      toast.success(`折扣碼套用成功！${discountData.description}`);
      setIsApplying(false);
    } catch (error) {
      console.error('💥 [DiscountCode] 折扣碼驗證錯誤:', error);
      toast.error("折扣碼驗證失敗，請稍後再試");
      setIsApplying(false);
    }
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
        </div>
      )}
    </div>
  );
};

export default DiscountCode; 