"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AddOnItem as AddOnItemType } from "@/lib/types/cart";
import { ShoppingCart } from "lucide-react";
import FancyButton from "@/components/ui/FancyButton";

interface AddOnItemProps {
  item: AddOnItemType;
}

const AddOnItem = ({ item }: AddOnItemProps) => {
  const { id, name, image, originalPrice, discountPrice } = item;

  return (
    <div className="flex flex-col items-center">
      {/* 商品圖片 */}
      <div className="aspect-square relative w-full rounded-xl overflow-hidden border-4 border-gray-300  mb-3">
        <Image 
          src={image || "/images/books/placeholder.jpg"} 
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className="object-cover"
        />
      </div>

      {/* 商品資訊 (外部) */}
      <div className="w-full text-center">
        <h3 className="text-lg font-medium text-teal-800 mb-1">{name}</h3>
        <div className="mb-2">
          <div className="text-xs text-gray-500 line-through">原價 NT${originalPrice}</div>
          <div className="text-base font-medium text-amber-700">加購價 ${discountPrice}</div>
        </div>
        <FancyButton 
          className="w-full text-base mt-2"
          hideIcons
          leftIcon={<ShoppingCart className="w-5 h-5" />}
        >
          馬上加購
        </FancyButton>
      </div>
    </div>
  );
};

export default AddOnItem; 