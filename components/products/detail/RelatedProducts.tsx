"use client";

import Image from "next/image";
import Link from "next/link";
import { Product, ProductDetail } from "@/lib/types/product";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchProductsByAgeRange } from "@/lib/api/products";

interface RelatedProductsProps {
  currentProduct: ProductDetail;
}

export default function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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

  // 獲取相關商品資料
  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!currentProduct?.ageRange?.id) {
        setError('無法獲取年齡範圍資訊');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const relatedProducts = await fetchProductsByAgeRange(currentProduct.ageRange.id);
        
        // 過濾掉當前商品
        const filteredProducts = relatedProducts.filter(
          product => product.id !== currentProduct.productId.toString()
        );
        
        setProducts(filteredProducts);
        // 重置到第一頁
        setCurrentIndex(0);
      } catch (err) {
        console.error('載入相關商品失敗:', err);
        setError('載入相關商品失敗');
      } finally {
        setIsLoading(false);
      }
    };

    loadRelatedProducts();
  }, [currentProduct]);

  // 監聽視窗大小變化，調整每頁顯示數量
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = getItemsPerView();
      setItemsPerPage(newItemsPerPage);
      
      // 重新計算當前頁面索引，確保不會超出範圍
      const newTotalPages = Math.ceil(products.length / newItemsPerPage);
      if (currentIndex >= newTotalPages && newTotalPages > 0) {
        setCurrentIndex(newTotalPages - 1);
      }
    };

    // 初始設置
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [products.length, currentIndex]);

  const nextSlide = useCallback(() => {
    const newTotalPages = Math.ceil(products.length / itemsPerPage);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % newTotalPages);
  }, [products.length, itemsPerPage]);

  const prevSlide = useCallback(() => {
    const newTotalPages = Math.ceil(products.length / itemsPerPage);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + newTotalPages) % newTotalPages);
  }, [products.length, itemsPerPage]);

  // 自動輪播
  useEffect(() => {
    const newTotalPages = Math.ceil(products.length / itemsPerPage);
    if (newTotalPages <= 1) return; // 如果只有一頁或沒有商品，不需要輪播
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % newTotalPages);
    }, 7000);
    
    return () => clearInterval(interval);
  }, [products.length, itemsPerPage]); // 移除 nextSlide 依賴

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
      console.log("已從收藏移除");
    } else {
      setFavorites([...favorites, productId]);
      console.log("已加入收藏");
    }
  };

  const handleAddToCart = (product: Product) => {
    console.log(`已將《${product.name}》加入購物車！`);
  };

  // 根據當前頁取得顯示商品
  const getVisibleProducts = () => {
    const startIndex = currentIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  };

  // 如果正在載入，顯示載入狀態
  if (isLoading) {
    return (
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-800 font-jf-openhuninn tracking-wider">探索更多故事</h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-800"></div>
            <span className="ml-3 text-emerald-800">載入相關商品中...</span>
          </div>
        </div>
      </section>
    );
  }

  // 如果發生錯誤或沒有相關商品，顯示提示訊息
  if (error || products.length === 0) {
    return (
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-800 font-jf-openhuninn tracking-wider">探索更多故事</h2>
          </div>
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-500 text-center">
              {error || '暫無相關商品'}
            </p>
          </div>
        </div>
      </section>
    );
  }

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
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-800 font-jf-openhuninn tracking-wider">探索更多故事</h2>
        </div>

        {/* 相關商品輪播 */}
        <div className="relative overflow-hidden px-1 md:px-4">
          <div className="flex gap-6 md:gap-4">
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
                          className="object-contain transition-transform duration-500"
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* 書名 */}
                  <h3 className="text-center text-base md:text-lg font-medium text-[#2F726D] font-jf-openhuninn hover:text-[#E8652B] transition-colors duration-300 line-clamp-2 min-h-[3rem]">
                    {item.name}
                  </h3>

                  {/* 價格 */}
                  <div className="flex items-center justify-center mt-2">
                    <span className="text-base md:text-lg text-[#E8652B] font-jf-openhuninn">
                      NT${item.price}
                    </span>
                    <span className="ml-2 text-xs md:text-sm text-gray-500 line-through">原價 NT${item.originalPrice}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 分頁指示器 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'bg-orange-500 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`第 ${index + 1} 頁`}
              />
            ))}
          </div>
        )}

        {/* 左右箭頭按鈕 - 只在有多頁時顯示 */}
        {totalPages > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute top-1/2 -translate-y-1/2 -left-6 md:-left-5 w-12 h-12 md:w-14 md:h-14 bg-orange-500 text-white rounded-full shadow-[3px_4px_0px_0px_rgba(116,40,26,1)] hover:shadow-[1px_2px_0px_0px_rgba(116,40,26,1)] transition-all flex items-center justify-center"
              aria-label="上一頁"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute top-1/2 -translate-y-1/2 -right-6 md:-right-5 w-12 h-12 md:w-14 md:h-14 bg-orange-500 text-white rounded-full shadow-[3px_4px_0px_0px_rgba(116,40,26,1)] hover:shadow-[1px_2px_0px_0px_rgba(116,40,26,1)] transition-all flex items-center justify-center"
              aria-label="下一頁"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </>
        )}
      </div>
    </section>
  );
} 