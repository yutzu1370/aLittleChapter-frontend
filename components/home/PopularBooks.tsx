"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import type { SwiperRef } from 'swiper/react'
import { toast } from "sonner"
import Link from "next/link"
import { fetchPopularProducts } from '@/lib/api/homePopular'
import { Book } from '@/lib/types/book'
import { useAuthStore } from "@/lib/store/useAuthStore"
import { useFavoritesStore } from "@/lib/store/useFavoritesStore"
import { useCartStore } from "@/lib/store/useCartStore"
import { useDebounce } from "@/hooks/use-debounce"
import { addItemToBackendApi } from "@/lib/api/cart"
import { addToWishlistApi, removeFromWishlistApi } from "@/lib/api/wishlist"
/*
// 定義書籍類型
type Book = {
  id: number
  title: string
  author: string
  publisher: string
  price: number
  originalPrice: number
  image: string
  category: string
  ageRange: string
  tags: { text: string; type: string }[]
  isNew?: boolean
  isHot?: boolean
  isDiscount?: boolean
  discountPrice?: number | null
  imageUrl?: string
  introductionHtml?: string
}
*/
// 定義時段數據類型
type TimeSlotData = {
  [key: string]: {
    label: string
  }
}

// 自定義 Swiper 樣式
const swiperStyles = `
  .swiper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 10px;
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

export default function PopularBooks() {
  // 狀態管理
  const [popularBooks, setPopularBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTimeSlot, setActiveTimeSlot] = useState("12:00")
  const [hours, setHours] = useState(1)
  const [minutes, setMinutes] = useState(59)
  const [seconds, setSeconds] = useState(36)
  const swiperRef = useRef<SwiperRef | null>(null)
  
  const { isAuthenticated } = useAuthStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const { addItem } = useCartStore();

  // 獲取熱門產品數據
  useEffect(() => {
    const fetchPopularProductsData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await fetchPopularProducts()
        
        // 將 API 數據映射到 Book 類型
        const mappedBooks: Book[] = data.books.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          publisher: book.publisher,
          imageUrl: book.imageUrl,
          categoryName: book.categoryName,
          ageRangeName: book.ageRangeName,
          price: book.price,
          isNewArrival: book.isNewArrival,
          isBestseller: book.isBestseller,
          discountPrice: book.discountPrice,
          introductionHtml: book.introductionHtml,
          quantity: book.quantity,
          stockQuantity: book.stockQuantity
        }))
        
        setPopularBooks(mappedBooks)
      } catch (error) {
        setError('無法載入熱門商品資料')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPopularProductsData()
  }, [])

  // 時段資料定義 - 只用於顯示按鈕，不再連動卡片
  const timeSlotData: TimeSlotData = {
    "12:00": {
      label: "現正瘋搶",
    },
    "08:00": {
      label: "明天開搶",
    },
    "18:00": {
      label: "明天開搶",
    },
  }

  // 動態添加自定義樣式
  useEffect(() => {
    const styleId = 'swiper-custom-styles-popular';
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

  // 計時器
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1)
      } else if (minutes > 0) {
        setMinutes(minutes - 1)
        setSeconds(59)
      } else if (hours > 0) {
        setHours(hours - 1)
        setMinutes(59)
        setSeconds(59)
      } else {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [hours, minutes, seconds])

  // 原始處理函數
  const handleToggleFavoriteOriginal = async (bookId: number) => {
    if (!isAuthenticated) {
      // 訪客使用者：只顯示提醒訊息
      toast.info("請先登入", {
        description: "登入後才能使用收藏功能",
        duration: 3000,
      });
      return;
    }

    // 已登入使用者：切換收藏狀態
    const isCurrentlyFavorite = isFavorite(bookId);
    const book = popularBooks.find(b => b.id === bookId);
    
    try {
      if (isCurrentlyFavorite) {
        // 刪除收藏
        const response = await removeFromWishlistApi(bookId);
        if (response.status) {
          toggleFavorite(bookId);
          // 觸發收藏變更事件
          window.dispatchEvent(new CustomEvent('wishlistChanged'));
          toast.success(`《${book?.title}》已從收藏移除`, {
            position: "top-center",
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
        const response = await addToWishlistApi(bookId);
        if (response.status) {
          toggleFavorite(bookId);
          // 觸發收藏變更事件
          window.dispatchEvent(new CustomEvent('wishlistChanged'));
          toast.success(`《${book?.title}》已加入收藏`, {
            position: "top-center",
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

  const handleAddToCartOriginal = async (book: Book) => {
    try {
      // 將 Book 類型轉換為 Product 類型以符合 addItem 的要求
      const productForCart = {
        id: book.id.toString(),
        name: book.title,
        description: book.introductionHtml || '',
        price: book.discountPrice || book.price,
        originalPrice: book.price,
        image: book.imageUrl || '',
        stockQuantity: book.stockQuantity, // 使用 API 回應的庫存數量
        authorName: book.author,
        publisherName: book.publisher,
      };
      
      // 加入到本地購物車（localStorage）
      addItem(productForCart, 1);
      
      // 如果使用者已登入，同時加入到後端購物車
      if (isAuthenticated) {
        const cartItem = {
          productId: book.id,
          quantity: 1
        };
        
        const backendResult = await addItemToBackendApi(cartItem);
        
        if (!backendResult.status) {
          // 即使後端失敗，本地購物車已經成功，所以仍然顯示成功訊息
          // 但可以在控制台記錄警告
        }
      }
      
      toast.success(`已將《${book.title}》加入購物車！`, {
        position: "top-center",
        duration: 2000,
      });
    } catch (error) {
      toast.error("加入購物車失敗", {
        description: "請稍後再試",
        duration: 3000,
      });
    }
  };

  // 使用 debounce 包裝的處理函數
  const handleToggleFavorite = useDebounce(handleToggleFavoriteOriginal, 500);
  const handleAddToCart = useDebounce(handleAddToCartOriginal, 500);

  // 獲取當前螢幕的每頁顯示數量
  const getSlidesPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 768) return 2;
      return 4;
    }
    return 4;
  };

  // 處理時段切換 - 僅更新活動時段，不再連動卡片
  const handlePrevClick = () => {
    if (swiperRef.current?.swiper) {
      const slidesPerView = getSlidesPerView();
      swiperRef.current.swiper.slideTo(swiperRef.current.swiper.activeIndex - slidesPerView);
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current?.swiper) {
      const slidesPerView = getSlidesPerView();
      swiperRef.current.swiper.slideTo(swiperRef.current.swiper.activeIndex + slidesPerView);
    }
  };

  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-white">
      <div className="container-wrapper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="flex justify-center items-center mb-12 sm:mb-14 lg:mb-16">
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 mr-3 sm:mr-4">
              <Image
                src="/images/icon/icon_clock.png"
                alt="Icon"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#2F726D] tracking-widest"
            >
              熱銷排行
            </motion.h2>
          </div>

          {/* Countdown and Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            {/* Countdown */}
            <motion.div 
              className="flex items-center order-2 sm:order-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center w-12 h-10 sm:w-14 sm:h-11 lg:w-16 lg:h-12 bg-white border-2 sm:border-3 lg:border-4 border-gray-300 rounded-lg sm:rounded-xl">
                <span className="text-[#3E8E87] text-lg sm:text-xl lg:text-2xl font-['jf-openhuninn-2.0']">
                  {hours.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="text-[#3E8E87] text-2xl sm:text-3xl lg:text-4xl mx-1 sm:mx-2 font-['Coiny']">:</span>
              <div className="flex items-center justify-center w-12 h-10 sm:w-14 sm:h-11 lg:w-16 lg:h-12 bg-white border-2 sm:border-3 lg:border-4 border-gray-300 rounded-lg sm:rounded-xl">
                <span className="text-[#3E8E87] text-lg sm:text-xl lg:text-2xl font-['jf-openhuninn-2.0']">
                  {minutes.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="text-[#3E8E87] text-2xl sm:text-3xl lg:text-4xl mx-1 sm:mx-2 font-['Coiny']">:</span>
              <div className="flex items-center justify-center w-12 h-10 sm:w-14 sm:h-11 lg:w-16 lg:h-12 bg-white border-2 sm:border-3 lg:border-4 border-gray-300 rounded-lg sm:rounded-xl">
                <span className="text-[#3E8E87] text-lg sm:text-xl lg:text-2xl font-['jf-openhuninn-2.0']">
                  {seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </motion.div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 order-1 sm:order-2 w-full sm:w-auto">
              {Object.entries(timeSlotData).map(([time, data]) => (
                <motion.button
                  key={time}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold transition-colors duration-300 text-sm sm:text-base ${
                    activeTimeSlot === time
                      ? "bg-[#3E8E87] text-white"
                      : "bg-white border-2 border-gray-300 text-gray-500 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTimeSlot(time)}
                >
                  {time} {data.label}
                </motion.button>
              ))}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-gray-900 font-semibold flex items-center hover:text-[#E8652B] transition-colors duration-300 text-sm sm:text-base"
              >
                查看更多 <ChevronRight className="ml-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </motion.button>
            </div>
          </div>

          {/* Loading 狀態顯示 */}
          {loading && (
            <div className="flex justify-center items-center py-16 sm:py-20">
              <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-[#3E8E87]"></div>
            </div>
          )}

          {/* 錯誤狀態顯示 */}
          {error && (
            <div className="flex justify-center items-center py-16 sm:py-20">
              <div className="text-center">
                <p className="text-red-500 text-base sm:text-lg">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-[#3E8E87] text-white rounded-full text-sm sm:text-base"
                >
                  重新載入
                </button>
              </div>
            </div>
          )}

          {/* Book Display */}
          {!loading && !error && popularBooks.length > 0 && (
            <div className="relative">
              {/* Left Arrow - 隱藏在手機端 */}
              <motion.button 
                className="hidden lg:flex absolute -left-6 xl:-left-10 top-1/4 transform -translate-y-1/2 w-16 h-16 xl:w-20 xl:h-20 bg-[#E8652B] rounded-full shadow-[4px_6px_0px_#74281A] items-center justify-center z-10 origin-center"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevClick}
                aria-label="上一頁"
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ChevronLeft className="w-8 h-8 xl:w-10 xl:h-10 text-white" />
              </motion.button>

              {/* Books Grid with Swiper */}
              <Swiper
                modules={[Navigation]}
                spaceBetween={16}
                slidesPerView={1}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                  },
                }}
                className="!pb-6 sm:!pb-8"
                ref={swiperRef}
              >
                {popularBooks.map((book) => (
                  <SwiperSlide key={book.id}>
                    <motion.div 
                      className="relative pt-2 group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ y: -3 }}
                    >
                      {/* Book Image with Tag */}
                      <div className="relative mb-4">
                        <Link href={`/products/${book.id}`}>
                          <motion.div 
                            className="border-4 border-gray-300 rounded-xl overflow-hidden"
                            whileHover={{ 
                              borderColor: "#E8652B",
                              boxShadow: "0 10px 15px -3px rgba(232, 101, 43, 0.3)",
                              transition: { duration: 0.3 }
                            }}
                          >
                            <div className="p-3 sm:p-4">
                              <Image
                                src={book.imageUrl || "/placeholder.svg"}
                                alt={book.title}
                                width={354}
                                height={354}
                                className="w-full h-auto transition-all duration-500 rounded-lg aspect-square object-cover"
                              />
                            </div>
                          </motion.div>
                        </Link>

                        {/* Corner Tag */}
                        {book.isNewArrival && (
                          <motion.div 
                            className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="absolute top-3 sm:top-4 right-1 transform translate-x-6 sm:translate-x-8 -translate-y-2 rotate-45 bg-[#3E8E87] text-white py-1 px-6 sm:px-8 text-center">
                              <span className="text-white text-sm sm:text-xl font-['jf-openhuninn-2.0']">NEW</span>
                            </div>
                          </motion.div>
                        )}

                        {book.isBestseller && (
                          <motion.div 
                            className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 overflow-hidden"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="absolute top-3 sm:top-4 right-1 transform translate-x-6 sm:translate-x-8 -translate-y-2 rotate-45 bg-[#E8652B] text-white py-1 px-6 sm:px-8 text-center">
                              <span className="text-white text-sm sm:text-xl font-['jf-openhuninn-2.0']">HOT</span>
                            </div>
                          </motion.div>
                        )}

                        {/* Hover Action Buttons - 改為手機可見 */}
                        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 flex items-end justify-center gap-2 p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.button 
                            whileHover={{ scale: 1.05, backgroundColor: "#E8652B", color: "white" }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 h-10 sm:h-12 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[3px_4px_0px_#74281A] sm:shadow-[4px_6px_0px_#74281A] transition-colors duration-100 text-xs sm:text-sm"
                            onClick={() => 
                              handleAddToCart(book)}
                          >
                            加入購物車
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 ${
                              isAuthenticated && isFavorite(book.id) 
                                ? "border-[#E8652B] bg-[#FEF5EE]" 
                                : "border-[#E8652B]"
                            } rounded-full flex items-center justify-center shadow-[3px_4px_0px_#74281A] sm:shadow-[4px_6px_0px_#74281A]`}
                            onClick={() => handleToggleFavorite(book.id)}
                            aria-label={isAuthenticated && isFavorite(book.id) ? "從收藏移除" : "加入收藏"}
                          >
                            <Heart 
                              className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                                isAuthenticated && isFavorite(book.id) 
                                  ? "text-[#E8652B] fill-[#E8652B]" 
                                  : "text-[#E8652B]"
                              }`} 
                            />
                          </motion.button>
                        </div>
                      </div>

                      {/* Book Info */}
                      <motion.div 
                        className="space-y-2 ml-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {/* Category and Age Range */}
                        <div className="flex gap-1 sm:gap-2 mb-1">
                          <span className="px-2 sm:px-3 lg:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold bg-[#F3FAF8] text-[#295C58]">
                            {book.categoryName}
                          </span>
                          <span className="px-2 sm:px-3 lg:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold bg-[#FEF5EE] text-[#B4371A]">
                            {book.ageRangeName}
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={`/products/${book.id}`}>
                          <h3 className="text-lg sm:text-xl text-[#2F726D] hover:text-[#E8652B] transition-colors duration-300 cursor-pointer line-clamp-2">
                            {book.title}
                          </h3>
                        </Link>

                        {/* Author & Publisher */}
                        <div className="flex text-xs sm:text-sm text-gray-700">
                          <span className="mr-2">{book.author}</span>
                          <span>{book.publisher}</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-end">
                          <motion.span 
                            className="text-lg sm:text-xl text-[#E8652B]"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            ${book.discountPrice ? book.discountPrice : book.price}
                          </motion.span>
                          {book.discountPrice && (
                            <span className="ml-2 text-xs sm:text-sm text-gray-700 line-through">原價 NT${book.price}</span>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Right Arrow - 隱藏在手機端 */}
              <motion.button 
                className="hidden lg:flex absolute -right-6 xl:-right-10 top-1/4 transform -translate-y-1/2 w-16 h-16 xl:w-20 xl:h-20 bg-[#E8652B] rounded-full shadow-[4px_6px_0px_#74281A] items-center justify-center z-10 origin-center"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextClick}
                aria-label="下一頁"
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ChevronRight className="w-8 h-8 xl:w-10 xl:h-10 text-white" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
