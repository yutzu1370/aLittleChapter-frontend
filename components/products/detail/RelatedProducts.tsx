"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types/product";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // 計算每屏顯示的數量和總頁數
  const getItemsPerView = () => {
    // 在客戶端渲染時才能訪問 window 對象
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 2; // 手機版顯示2個
      if (window.innerWidth < 768) return 3; // 平板顯示3個
      return 4; // 桌面顯示4個
    }
    return 4; // 默認桌面顯示4個
  };

  const [itemsPerPage, setItemsPerPage] = useState(4);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // 監聽視窗大小變化，調整每頁顯示數量
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerView());
    };

    // 初始設置
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  // 自動輪播
  useEffect(() => {
    const interval = setInterval(() => {
      if (products.length > itemsPerPage) {
        nextSlide();
      }
    }, 7000);
    return () => clearInterval(interval);
  }, [products.length]);

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
      toast.success("已從收藏移除");
    } else {
      setFavorites([...favorites, productId]);
      toast.success("已加入收藏");
    }
  };

  const handleAddToCart = (product: Product) => {
    toast.success(`已將《${product.name}》加入購物車！`);
  };

  // 根據當前頁取得顯示商品
  const getVisibleProducts = () => {
    const startIndex = currentIndex * itemsPerPage;
    return products.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-8 md:mb-16">
          <div className="w-8 h-8 md:w-12 md:h-12 overflow-hidden">
            <Image 
              src="/images/icon/icon_map.png" 
              alt="探索更多故事" 
              width={48} 
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-800 font-['jf-openhuninn-2.0'] tracking-wider">探索更多故事</h2>
        </div>

        {/* 相關商品輪播 */}
        <div className="relative overflow-hidden px-1 md:px-4">
          <motion.div 
            className="flex gap-6 md:gap-4"
            animate={{
              x: `-${currentIndex * 100}%`
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
          >
            {getVisibleProducts().map((item) => (
              <motion.div 
                key={item.id} 
                className="relative min-w-[calc(50%-12px)] sm:min-w-[calc(33.333%-16px)] md:min-w-[calc(25%-24px)] flex-grow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/products/${item.id}`} className="block bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="relative mb-2">
                    <motion.div 
                      className="border-[5px] border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm"
    
                    >
                      <div className="aspect-square relative p-2">
                        <Image 
                          src={item.image || "/images/books/placeholder.jpg"} 
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          className="object-contain transition-transform duration-500 "
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* 書名 */}
                  <h3 className="text-center text-base md:text-lg font-medium text-[#2F726D] font-['jf-openhuninn-2.0'] hover:text-[#E8652B] transition-colors duration-300 line-clamp-2 min-h-[3rem]">
                    {item.name}
                  </h3>

                  {/* 價格 */}
                  <div className="flex items-center justify-center mt-2">
                    <span className="text-base md:text-lg text-[#E8652B] font-['jf-openhuninn-2.0']">
                      NT${item.price}
                    </span>
                    <span className="ml-2 text-xs md:text-sm text-gray-500 line-through">原價 NT${item.originalPrice}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 頁數指示器 */}
        {/* 已移除圓點指示器 */}

        {/* 左右箭頭按鈕 */}
        <button 
          onClick={prevSlide}
          className="absolute top-1/2 -translate-y-1/2 -left-6 md:-left-5 w-12 h-12 md:w-14 md:h-14 bg-orange-500 text-white rounded-full shadow-[3px_4px_0px_0px_rgba(116,40,26,1)] hover: hover:shadow-[1px_2px_0px_0px_rgba(116,40,26,1)] transition-all flex items-center justify-center"
          aria-label="上一頁"
        >
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute top-1/2 -translate-y-1/2 -right-6 md:-right-5 w-12 h-12 md:w-14 md:h-14 bg-orange-500 text-white rounded-full shadow-[3px_4px_0px_0px_rgba(116,40,26,1)] hover: hover:shadow-[1px_2px_0px_0px_rgba(116,40,26,1)] transition-all flex items-center justify-center"
          aria-label="下一頁"
        >
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </button>
      </div>
    </section>
  );
} 