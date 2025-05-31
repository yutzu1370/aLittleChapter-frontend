"use client"

import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartStore } from "@/lib/store/useCartStore";
import { Heart, Trash2, Minus, Plus } from "lucide-react";

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
  const { productId, name, discountPrice, price, imageUrl, quantity, isSelected } = item;

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(productId, quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateQuantity(productId, quantity + 1);
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
            {productId === 1 ? "僅剩 2 本" : "預計 5/20 出貨"}
          </div>
        </div>
      </div>

      {/* 價格 */}
      <div className="w-[110px]">
        <div className="flex flex-col">
          <span className="text-base font-medium">
            <span className="font-jf-openhuninn">$</span>
            <span className="font-coiny">{discountPrice.toLocaleString('zh-TW')}</span>
          </span>
          <span className="text-xs line-through text-gray-500">
            <span className="font-jf-openhuninn">$</span>
            <span className="font-coiny">{price.toLocaleString('zh-TW')}</span>
          </span>
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
            <div className="w-10 text-center font-medium">
              {quantity}
            </div>
            <button 
              onClick={handleIncrease}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => {}}
              className="inline-flex items-center text-xs text-amber-600 hover:text-amber-700"
            >
              <Heart className="w-4 h-4 mr-1" />
              收藏
            </button>
            <button 
              onClick={() => removeItem(productId)}
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
          <span className="font-jf-openhuninn">$</span>
          <span className="font-coiny">{(discountPrice * quantity).toLocaleString('zh-TW')}</span>
        </span>
      </div>
    </div>
  );
};

export default CartItem; 