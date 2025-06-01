"use client"

import Image from "next/image";
import { Trash2, Heart, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/lib/store/useCartStore";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";

interface AddedOnItemsBlockProps {
  isVisible: boolean;
  onClose: () => void;
}

const AddedOnItemsBlock = ({ isVisible, onClose }: AddedOnItemsBlockProps) => {
  const { addedOnItems, updateAddOnQuantity, removeAddOnItem, getAddOnSubtotal } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();

  if (!isVisible || addedOnItems.length === 0) {
    return null;
  }

  const handleDecrease = (itemId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateAddOnQuantity(itemId, currentQuantity - 1);
    }
  };

  const handleIncrease = (itemId: number, currentQuantity: number) => {
    updateAddOnQuantity(itemId, currentQuantity + 1);
  };

  const handleToggleFavorite = (productId: number) => {
    const newFavoriteState = toggleFavorite(productId);
    
    if (!isAuthenticated) {
      // 訪客使用者：顯示登入提示
      toast.success(newFavoriteState ? "已加入收藏" : "已從收藏移除", {
        description: "登入後可永久保存收藏",
        duration: 4000,
      });
      return;
    }

    // TODO: 已登入使用者的收藏功能 - 同步到後端
    toast.success(newFavoriteState ? "已加入收藏" : "已從收藏移除", {
      duration: 3000,
    });
  };

  const subtotal = getAddOnSubtotal();

  return (
    <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-teal-800">已加購商品</h2>
      </div>

      <div className="space-y-4">
        {addedOnItems.map((item) => {
          const isFavoriteProduct = isFavorite(item.productId);
          
          return (
            <div key={item.productId} className="flex items-center gap-4 p-4 bg-[#F3FAF8] rounded-xl">
              {/* 商品圖片 */}
              <div className="aspect-square relative w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-300 flex-shrink-0">
                <Image 
                  src={item.imageUrl || "/images/books/placeholder.jpg"} 
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              {/* 商品資訊 */}
              <div className="flex-1">
                <h3 className="text-base font-medium text-teal-800 mb-1">{item.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 line-through">原價 NT${item.price}</span>
                </div>
              </div>

              {/* 小計 */}
              <div className="text-right min-w-[80px]">
                <span className="text-sm font-medium">
                  <span className="font-jf-openhuninn">加購價 ${(item.addOnPrice * (item.quantity || 0)).toLocaleString('zh-TW')}</span>
                </span>
              </div>

              {/* 收藏和移除按鈕 */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleToggleFavorite(item.productId)}
                  className={`inline-flex items-center text-xs transition-colors ${
                    isFavoriteProduct 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-amber-600 hover:text-amber-700'
                  }`}
                  aria-label={isFavoriteProduct ? "從收藏移除" : "加入收藏"}
                >
                  <Heart 
                    className={`w-4 h-4 mr-1 ${
                      isFavoriteProduct ? 'fill-current' : ''
                    }`} 
                  />
                  {isFavoriteProduct ? '已收藏' : '收藏'}
                </button>
                <button 
                  onClick={() => removeAddOnItem(item.productId)}
                  className="inline-flex items-center text-xs text-amber-600 hover:text-amber-700"
                  aria-label="移除商品"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  移除
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AddedOnItemsBlock; 