"use client";

import Image from "next/image";
import Link from "next/link";
import { Product, ProductDetail } from "@/lib/types/product";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchProductsByAgeRange } from "@/lib/api/products";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { SwiperRef } from 'swiper/react';

// 自定義 Swiper 樣式
const swiperStyles = `
  .swiper {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .swiper-wrapper {
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    transition-property: transform;
    box-sizing: content-box;
  }
  
  .swiper-slide {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    position: relative;
    transition-property: transform;
    display: block;
  }
`;

interface RelatedProductsProps {
  currentProduct: ProductDetail;
}

export default function RelatedProducts({ currentProduct }: RelatedProductsProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<SwiperRef | null>(null);

  // 動態添加自定義樣式
  useEffect(() => {
    const styleId = 'swiper-custom-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = swiperStyles;
      document.head.appendChild(style);
    }
    
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

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
      } catch (err) {
        console.error('載入相關商品失敗:', err);
        setError('載入相關商品失敗');
      } finally {
        setIsLoading(false);
      }
    };

    loadRelatedProducts();
  }, [currentProduct]);

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

  // 獲取當前螢幕的每頁顯示數量
  const getSlidesPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 2;
      if (window.innerWidth < 768) return 3;
      return 4;
    }
    return 4;
  };

  // 自定義導航函數
  const handlePrevClick = () => {
    if (swiperRef.current?.swiper) {
      const slidesPerView = getSlidesPerView();
      for (let i = 0; i < slidesPerView; i++) {
        swiperRef.current.swiper.slidePrev();
      }
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current?.swiper) {
      const slidesPerView = getSlidesPerView();
      for (let i = 0; i < slidesPerView; i++) {
        swiperRef.current.swiper.slideNext();
      }
    }
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

        {/* Swiper 輪播 */}
        <div className="relative">
          <Swiper
            modules={[]}
            spaceBetween={16}
            slidesPerView={getSlidesPerView()}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            className="!pb-12"
            ref={swiperRef}
          >
            {products.map((item) => (
              <SwiperSlide key={item.id}>
                <motion.div 
                  className="relative"
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
                      {item.originalPrice !== item.price && (
                        <span className="ml-2 text-xs md:text-sm text-gray-500 line-through">原價 NT${item.originalPrice}</span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 自定義導航按鈕 */}
          <button 
            className="swiper-button-prev-custom absolute top-[35%] -translate-y-1/2 -left-6 md:-left-5 w-12 h-12 md:w-14 md:h-14 bg-orange-500 text-white rounded-full shadow-[3px_4px_0px_0px_rgba(116,40,26,1)] hover:shadow-[1px_2px_0px_0px_rgba(116,40,26,1)] transition-all flex items-center justify-center z-10"
            aria-label="上一頁"
            onClick={handlePrevClick}
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          <button 
            className="swiper-button-next-custom absolute top-[35%] -translate-y-1/2 -right-6 md:-right-5 w-12 h-12 md:w-14 md:h-14 bg-orange-500 text-white rounded-full shadow-[3px_4px_0px_0px_rgba(116,40,26,1)] hover:shadow-[1px_2px_0px_0px_rgba(116,40,26,1)] transition-all flex items-center justify-center z-10"
            aria-label="下一頁"
            onClick={handleNextClick}
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
      </div>
    </section>
  );
} 