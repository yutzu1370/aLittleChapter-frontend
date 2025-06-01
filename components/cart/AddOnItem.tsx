"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import FancyButton from "@/components/ui/FancyButton";
import { useCartStore } from "@/lib/store/useCartStore";
import { toast } from "sonner";

interface AddOnItemProps {
  item: {
    productId: number;
    name: string;
    price: number;
    addOnPrice: number;
    imageUrl: string;
  };
  onAddToCart?: () => void;
}

const AddOnItem = ({ item, onAddToCart }: AddOnItemProps) => {
  const { productId, name, imageUrl, price, addOnPrice } = item;
  const { addOnItem, addedOnItems } = useCartStore();

  // 檢查商品是否已經加購過
  const isAlreadyAdded = addedOnItems.some(addedItem => addedItem.productId === productId);

  const handleAddToCart = () => {
    if (isAlreadyAdded) {
      toast.warning("商品已加購", {
        description: `${name} 已經在加購清單中`,
        duration: 3000,
      });
      return;
    }

    addOnItem(item, 1);
    toast.success("已加入購物車", {
      description: `${name} 已加入購物車`,
      duration: 3000,
    });
    
    // 呼叫父組件的回調函數（用於顯示已加購商品區塊）
    if (onAddToCart) {
      onAddToCart();
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* 商品圖片 */}
      <div className="aspect-square relative w-full rounded-xl overflow-hidden border-4 border-gray-300 bg-gray-50 mb-3 flex items-center justify-center">
        <div className="w-[88%] h-[88%] relative">
          <Image 
            src={imageUrl || "/images/books/placeholder.jpg"} 
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      {/* 商品資訊 (外部) */}
      <div className="w-full text-center">
        <h3 className="text-lg font-medium text-teal-800 mb-1 h-14 flex items-center justify-center line-clamp-2 leading-tight">{name}</h3>
        <div className="mb-2">
          <div className="text-xs text-gray-500 line-through">原價 NT${price}</div>
          <div className="text-base font-medium text-amber-700">加購價 ${addOnPrice}</div>
        </div>
        <FancyButton 
          className={`w-full text-base mt-2 ${isAlreadyAdded ? 'opacity-50 cursor-not-allowed' : ''}`}
          hideIcons
          leftIcon={<ShoppingCart className="w-5 h-5" />}
          onClick={handleAddToCart}
          disabled={isAlreadyAdded}
        >
          {isAlreadyAdded ? '已加購' : '馬上加購'}
        </FancyButton>
      </div>
    </div>
  );
};

export default AddOnItem; 