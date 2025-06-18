"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImagesProps {
  images: string[];
  productName: string;
}

export default function ProductImages({ images, productName }: ProductImagesProps) {
  // 圖片陣列已經在 API 層排序，第一張圖片是主圖片（isPrimary: true）
  const [mainImage, setMainImage] = useState(images[0] || "/images/books/placeholder.jpg");

  return (
    <div className="w-full md:w-[480px] flex-shrink-0 mb-6 md:mb-0">
      {/* 主圖片顯示區域 */}
      <div className="bg-white rounded-3xl overflow-hidden mb-4 sm:mb-6">
        <div className="relative w-full aspect-square">
          <Image 
            src={mainImage} 
            alt={productName}
            fill
            className="object-cover rounded-3xl"
            priority
            sizes="(max-width: 768px) 100vw, 480px"
          />
        </div>
      </div>
      
      {/* 縮圖選擇區域 - 響應式網格 */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-3 sm:pt-5">
        {images.slice(0, 6).map((img, idx) => (
          <div 
            key={idx} 
            className={`cursor-pointer relative aspect-square rounded-lg overflow-hidden border-2 sm:border-4 transition-colors ${
              mainImage === img ? 'border-[#b1ded6]' : 'border-transparent'
            }`}
            onClick={() => setMainImage(img)}
          >
            <Image 
              src={img} 
              alt={`${productName} thumbnail ${idx + 1}`} 
              fill
              className="object-cover"
              sizes="(max-width: 640px) 25vw, (max-width: 768px) 16vw, 80px"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 