"use client"

import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartStore } from "@/lib/store/useCartStore";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Heart, Trash2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useDebounce } from "@/hooks/use-debounce";

// 簡化的購物車項目類型 - 與 useCartStore 中的類型保持一致
interface SimpleCartItem {
  productId: number;
  name: string;
  discountPrice: number;
  price: number;
  imageUrl: string;
  quantity: number;
  isSelected: boolean;
  stockQuantity: number;
}

interface CartItemProps {
  item: SimpleCartItem;
}

const CartItem = ({ item }: CartItemProps) => {
  const { toggleSelect, updateQuantity, removeItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { isAuthenticated } = useAuthStore();
  const { productId, name, discountPrice, price, imageUrl, quantity, isSelected, stockQuantity } = item;
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isFavoriteProduct = isFavorite(productId);

  // 原始處理函數
  const handleDecreaseOriginal = () => {
    if (quantity > 1) {
      updateQuantity(productId, quantity - 1);
    }
  };

  const handleIncreaseOriginal = () => {
    if (quantity < stockQuantity) {
      updateQuantity(productId, quantity + 1);
    } else {
      toast.warning("庫存不足", {
        description: `目前庫存僅剩 ${stockQuantity} 件`,
        duration: 3000,
      });
    }
  };

  const handleToggleFavoriteOriginal = () => {
    if (!isAuthenticated) {
      // 訪客使用者：只顯示提醒訊息，不顯示登入視窗
      toast.info("請先登入", {
        description: "登入後才能使用收藏功能",
        duration: 3000,
      });
      return;
    }

    // 已登入使用者：切換收藏狀態
    const newFavoriteState = toggleFavorite(productId);
    
    // TODO: 已登入使用者的收藏功能 - 同步到後端
    toast.success(newFavoriteState ? "已加入收藏" : "已從收藏移除", {
      duration: 3000,
    });
  };

  const handleRemoveItemOriginal = () => {
    removeItem(productId);
  };

  // 使用 debounce 包裝的處理函數
  const handleDecrease = useDebounce(handleDecreaseOriginal, 300);
  const handleIncrease = useDebounce(handleIncreaseOriginal, 300);
  const handleToggleFavorite = useDebounce(handleToggleFavoriteOriginal, 500);
  const handleRemoveItem = useDebounce(handleRemoveItemOriginal, 500);

  const handleQuantityChangeOriginal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      if (newQuantity <= stockQuantity) {
        updateQuantity(productId, newQuantity);
      } else {
        toast.warning("庫存不足", {
          description: `目前庫存僅剩 ${stockQuantity} 件`,
          duration: 3000,
        });
        updateQuantity(productId, stockQuantity);
      }
    }
  };

  // 為數量輸入框添加 debounce
  const handleQuantityChange = useDebounce(handleQuantityChangeOriginal, 500);

  const handleQuantityBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) {
      updateQuantity(productId, 1);
    } else if (newQuantity > stockQuantity) {
      updateQuantity(productId, stockQuantity);
    }
  };

  return (
    <div className="flex items-center py-6 border-b border-gray-200">
      {/* 勾選框 */}
      <div className="w-[40px] ">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => toggleSelect(productId)}
          className="h-5 w-5 border-amber-600 data-[state=checked]:bg-amber-600 data-[state=checked]:text-white"
        />
      </div>

      {/* 商品資訊 */}
      <div className="flex flex-1 items-center gap-4">
        <div className="aspect-square relative w-[168px] rounded-xl overflow-hidden border-4 border-gray-300 bg-gray-50 mr-4 flex items-center justify-center">
          <div className="w-[88%] h-[88%] relative">
            <Image
              src={imageUrl || "/images/books/placeholder.jpg"}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 120px"
              className="object-cover rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-medium">{name}</h3>
          <div className="text-sm text-green-800">
            {stockQuantity > 0 ? `僅剩 ${stockQuantity} 本` : "缺貨中"}
          </div>
        </div>
      </div>

      {/* 價格 */}
      <div className="w-[110px]">
        <div className="flex flex-col">
          <span className="text-base font-medium">
            <span className="font-jf-openhuninn">${discountPrice.toLocaleString('zh-TW')}</span>
          </span>
          {price !== discountPrice && (
            <span className="text-xs line-through text-gray-500">
              <span className="font-jf-openhuninn">${price.toLocaleString('zh-TW')}</span>
            </span>
          )}
        </div>
      </div>

      {/* 數量控制 */}
      <div className="w-[120px]">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center border-4 border-[#F8D0B0] rounded-full p-1 bg-white">
            <button 
              onClick={handleDecrease}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              onBlur={handleQuantityBlur}
              min="1"
              max={stockQuantity}
              className="w-10 text-center font-medium bg-transparent border-none outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button 
              onClick={handleIncrease}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleToggleFavorite}
              className={`inline-flex items-center text-xs transition-colors ${
                isAuthenticated && isFavoriteProduct 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-amber-600 hover:text-amber-700'
              }`}
              aria-label={isAuthenticated && isFavoriteProduct ? "從收藏移除" : "加入收藏"}
            >
              <Heart 
                className={`w-4 h-4 mr-1 ${
                  isAuthenticated && isFavoriteProduct ? 'fill-current' : ''
                }`} 
              />
              {isAuthenticated && isFavoriteProduct ? '已收藏' : '收藏'}
            </button>
            <button 
              onClick={handleRemoveItem}
              className="inline-flex items-center text-xs text-amber-600 hover:text-amber-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              移除
            </button>
          </div>
        </div>
      </div>

      {/* 小計 */}
      <div className="w-[100px] text-right">
        <span className="text-lg font-medium">
          <span className="font-jf-openhuninn">${(discountPrice * quantity).toLocaleString('zh-TW')}</span>
        </span>
      </div>
      
      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />
    </div>
  );
};

export default CartItem; 