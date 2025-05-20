"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types/product";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div 
      className="relative flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      {/* 商品圖片 */}
      <div className="relative mb-4 group">
        <motion.div 
          className="relative aspect-square border-4 border-gray-300 rounded-xl overflow-hidden p-4"
          whileHover={{ 
            borderColor: "#E8652B",
            transition: { duration: 0.3 }
          }}
        >
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </motion.div>
        
        {/* 標籤 */}
        {product.isNew && (
          <motion.div 
            className="absolute top-0 right-0 w-24 h-24 overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute top-4 right-1 transform translate-x-8 -translate-y-2 rotate-45 bg-[#3E8E87] text-white py-1 px-8 text-center">
              <span className="text-white text-xl font-['jf-openhuninn-2.0']">NEW</span>
            </div>
          </motion.div>
        )}

        {product.isHot && (
          <motion.div 
            className="absolute top-0 right-0 w-24 h-24 overflow-hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute top-4 right-1 transform translate-x-8 -translate-y-2 rotate-45 bg-[#E8652B] text-white py-1 px-8 text-center">
              <span className="text-white text-xl font-['jf-openhuninn-2.0']">HOT</span>
            </div>
          </motion.div>
        )}
        
        {/* 購買/收藏按鈕 */}
        <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center gap-2 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: "#E8652B", color: "white" }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 h-12 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[4px_6px_0px_#74281A] transition-colors duration-100"
          >
            加入購物車
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-12 h-12 bg-white border-2 ${
              isFavorite 
                ? "border-[#E8652B] bg-[#FEF5EE]" 
                : "border-[#E8652B]"
            } rounded-full flex items-center justify-center shadow-[4px_6px_0px_#74281A]`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? "從收藏移除" : "加入收藏"}
          >
            <Heart 
              className={`w-6 h-6 ${
                isFavorite 
                  ? "text-[#E8652B] fill-[#E8652B]" 
                  : "text-[#E8652B]"
              }`} 
            />
          </motion.button>
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
          <span className="text-sm text-gray-500 line-through">原價 NT${product.originalPrice}</span>
        </div>
      </div>
    </motion.div>
  );
} 