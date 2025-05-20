"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex flex-col">
      {/* 商品圖片 */}
      <div className="relative mb-4 group">
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-gray-200">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        
        {/* 標籤 */}
        {product.isNew && (
          <div className="absolute top-2 right-2 bg-teal-600 text-white px-4 py-1 rounded-full text-sm font-bold">
            NEW
          </div>
        )}
        {product.isHot && (
          <div className="absolute top-2 right-2 bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold">
            HOT
          </div>
        )}
        
        {/* 購買/收藏按鈕 */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 py-4 px-4 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button className="flex-1 bg-white border-2 border-orange-600 text-orange-600 rounded-full py-2 px-4 font-semibold shadow-[3px_4px_0px_0px_rgba(116,40,26,0.8)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(116,40,26,0.8)] transition-all text-sm">
            加入購物車
          </button>
          <button className="w-10 h-10 rounded-full border-2 border-orange-600 flex items-center justify-center shadow-[3px_4px_0px_0px_rgba(116,40,26,0.8)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(116,40,26,0.8)] transition-all">
            <Image src="/images/icon/favorite-border.svg" alt="收藏" width={20} height={20} />
          </button>
        </div>
      </div>
      
      {/* 商品資訊 */}
      <div className="flex flex-col gap-1">
        <h3 className="text-xl font-jf-openhuninn text-emerald-800">{product.name}</h3>
        <div className="flex gap-2 text-sm text-gray-500">
          <span>{product.authorName}</span>
          <span>·</span>
          <span>{product.publisherName}</span>
        </div>
        <div className="flex gap-2 items-end">
          <span className="text-xl font-jf-openhuninn text-orange-600">${product.price}</span>
          <span className="text-sm text-gray-500">原價 NT${product.originalPrice}</span>
        </div>
      </div>
    </div>
  );
} 