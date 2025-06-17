"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types/product";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { toast } from "sonner";
import { AuthModal } from "@/components/auth/AuthModal";
import { addToWishlistApi, removeFromWishlistApi } from "@/lib/api/wishlist";
import { addItemToBackendApi } from "@/lib/api/cart";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addItem } = useCartStore();
  
  const productId = parseInt(product.id);
  const isFavoriteProduct = isFavorite(productId);
  
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // 訪客使用者：只顯示提醒訊息，不顯示登入視窗
      toast.info("請先登入", {
        description: "登入後才能使用收藏功能",
        duration: 3000,
      });
      return;
    }

    // 已登入使用者：切換收藏狀態
    const isCurrentlyFavorite = isFavorite(productId);
    
    try {
      if (isCurrentlyFavorite) {
        // 刪除收藏
        const response = await removeFromWishlistApi(productId);
        if (response.status) {
          toggleFavorite(productId);
          // 觸發收藏變更事件
          window.dispatchEvent(new CustomEvent('wishlistChanged'));
          toast.success("已從收藏移除", {
            duration: 2000,
          });
        } else {
          toast.error("移除收藏失敗", {
            description: response.message || "請稍後再試",
            duration: 3000,
          });
        }
      } else {
        // 新增收藏
        const response = await addToWishlistApi(productId);
        if (response.status) {
          toggleFavorite(productId);
          // 觸發收藏變更事件
          window.dispatchEvent(new CustomEvent('wishlistChanged'));
          toast.success("已加入收藏", {
            duration: 2000,
          });
        } else {
          toast.error("加入收藏失敗", {
            description: response.message || "請稍後再試",
            duration: 3000,
          });
        }
      }
    } catch (error) {

      toast.error("收藏操作失敗", {
        description: "請稍後再試",
        duration: 3000,
      });
    }
  };

  // 加入購物車
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 使用 useCartStore 的 addItem 方法
    addItem(product, 1);
    
    // 如果使用者已登入，同時加入到後端購物車
    if (isAuthenticated) {
      try {
        await addItemToBackendApi({ productId: Number(product.id), quantity: 1 });
        toast.success("已加入購物車", {
          duration: 2000,
        });
      } catch (error) {
        toast.error("加入購物車失敗", {
          description: "請稍後再試",
          duration: 3000,
        });
      }
    } else {
      toast.success("已加入購物車", {
        duration: 2000,
      });
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="block group">
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
            className="relative border-4 border-gray-300 rounded-xl overflow-hidden"
            whileHover={{ 
              borderColor: "#E8652B",
              transition: { duration: 0.3 }
            }}
          >
            <div className="p-3 sm:p-4">
              <Image 
                src={product.image} 
                alt={product.name} 
                width={354}
                height={354}
                className="w-full h-auto transition-all duration-500 rounded-lg aspect-square object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </motion.div>
          
        

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
              onClick={handleAddToCart}
            >
              加入購物車
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-12 h-12 bg-white border-2 ${
                isAuthenticated && isFavoriteProduct 
                  ? "border-[#E8652B] bg-[#FEF5EE]" 
                  : "border-[#E8652B]"
              } rounded-full flex items-center justify-center shadow-[4px_6px_0px_#74281A]`}
              onClick={handleToggleFavorite}
              aria-label={isAuthenticated && isFavoriteProduct ? "從收藏移除" : "加入收藏"}
            >
              <Heart 
                className={`w-6 h-6 ${
                  isAuthenticated && isFavoriteProduct 
                    ? "text-[#E8652B] fill-[#E8652B]" 
                    : "text-[#E8652B]"
                }`} 
              />
            </motion.button>
          </div>
        </div>
        
        {/* 商品資訊 */}
        <div className="flex flex-col gap-1">
          {/* Category and Age Range Tags (參考 PopularBooks.tsx) */}
          <div className="flex gap-1 sm:gap-2 mb-1">
            {product.categoryName && (
              <span className="px-2 sm:px-3 lg:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold bg-[#F3FAF8] text-[#295C58]">
                {product.categoryName}
              </span>
            )}
            {product.ageRangeName && (
              <span className="px-2 sm:px-3 lg:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold bg-[#FEF5EE] text-[#B4371A]">
                {product.ageRangeName}
              </span>
            )}
          </div>
          <h3 className="text-xl pl-1 font-jf-openhuninn text-emerald-800">{product.name}</h3>
          <div className="flex gap-2 pl-1 text-sm text-gray-500">
            <span>{product.authorName}</span>
            <span>·</span>
            <span>{product.publisherName}</span>
          </div>
          <div className="flex gap-2 pl-1 items-end">
            <span className="text-xl font-jf-openhuninn text-orange-600">${product.price}</span>
            {product.price !== product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">原價 NT${product.originalPrice}</span>
            )}
          </div>
        </div>
        
        {/* Auth Modal */}
        <AuthModal
          open={showAuthModal}
          onOpenChange={setShowAuthModal}
        />
      </motion.div>
    </Link>
  );
} 