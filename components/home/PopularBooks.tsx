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
        
        // 獲取熱門產品數據
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
        console.error('獲取熱門商品時發生錯誤:', error)
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
      console.error("收藏操作失敗:", error);
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
          console.warn('後端購物車同步失敗:', backendResult.message);
          // 即使後端失敗，本地購物車已經成功，所以仍然顯示成功訊息
          // 但可以在控制台記錄警告
        }
      }
      
      toast.success(`已將《${book.title}》加入購物車！`, {
        position: "top-center",
        duration: 2000,
      });
    } catch (error) {
      console.error("加入購物車失敗:", error);
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
    <section className="py-16 bg-white">
      <div className="container-wrapper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex justify-center items-center mb-16">
          <div className="w-12 h-12 mr-4">
            <Image
              src="/images/icon/icon_clock.png"
              alt="Icon"
              width={48}
              height={48}
              
            />
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-normal text-[#2F726D] tracking-widest "
          >
            熱銷排行
          </motion.h2>
        </div>

        {/* Countdown and Filters */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          {/* Countdown */}
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center w-16 h-12 bg-white border-4 border-gray-300 rounded-xl">
              <span className="text-[#3E8E87] text-2xl font-['jf-openhuninn-2.0']">
                {hours.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-[#3E8E87] text-4xl mx-2 font-['Coiny']">:</span>
            <div className="flex items-center justify-center w-16 h-12 bg-white border-4 border-gray-300 rounded-xl">
              <span className="text-[#3E8E87] text-2xl font-['jf-openhuninn-2.0']">
                {minutes.toString().padStart(2, '0')}
              </span>
            </div>
            <span className="text-[#3E8E87] text-4xl mx-2 font-['Coiny']">:</span>
            <div className="flex items-center justify-center w-16 h-12 bg-white border-4 border-gray-300 rounded-xl">
              <span className="text-[#3E8E87] text-2xl font-['jf-openhuninn-2.0']">
                {seconds.toString().padStart(2, '0')}
              </span>
            </div>
          </motion.div>

          {/* Filters - 注意：此處時段篩選僅為UI展示，與下方書籍卡片輪播不連動 */}
          <div className="flex space-x-2 mt-4 md:mt-0">
            {Object.entries(timeSlotData).map(([time, data]) => (
              <motion.button
                key={time}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
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
              className="px-4 py-2 text-gray-900 font-semibold flex items-center hover:text-[#E8652B] transition-colors duration-300"
            >
              查看更多 <ChevronRight className="ml-1 w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Loading 狀態顯示 */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#3E8E87]"></div>
          </div>
        )}

        {/* 錯誤狀態顯示 */}
        {error && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-red-500 text-lg">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-[#3E8E87] text-white rounded-full"
              >
                重新載入
              </button>
            </div>
          </div>
        )}

        {/* Book Display - 注意：此輪播顯示所有書籍，與上方時段篩選不連動 */}
        {!loading && !error && popularBooks.length > 0 && (
          <div className="relative">
            {/* Left Arrow */}
            <motion.button 
              className="absolute -left-10 top-1/4 transform -translate-y-1/2 w-20 h-20 bg-[#E8652B] rounded-full shadow-[4px_6px_0px_#74281A] flex items-center justify-center z-10 origin-center"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrevClick}
              aria-label="上一頁"
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ChevronLeft className="w-10 h-10 text-white" />
            </motion.button>

            {/* Books Grid with Swiper */}
            <Swiper
              modules={[Navigation]}
              spaceBetween={24}
              slidesPerView={getSlidesPerView()}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
              className="!pb-8"
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
                          <div className="p-4">
                            <Image
                              src={book.imageUrl || "/placeholder.svg"}
                              alt={book.title}
                              width={354}
                              height={354}
                              className="w-full h-auto transition-all duration-500 rounded-lg"
                            />
                          </div>
                        </motion.div>
                      </Link>

                      {/* Corner Tag */}
                      {book.isNewArrival && (
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

                      {book.isBestseller && (
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

                      {/* Hover Action Buttons */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center gap-2 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <motion.button 
                          whileHover={{ scale: 1.05, backgroundColor: "#E8652B", color: "white" }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 h-12 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[4px_6px_0px_#74281A] transition-colors duration-100"
                          onClick={() => handleAddToCart(book)}
                        >
                          加入購物車
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`w-12 h-12 bg-white border-2 ${
                            isAuthenticated && isFavorite(book.id) 
                              ? "border-[#E8652B] bg-[#FEF5EE]" 
                              : "border-[#E8652B]"
                          } rounded-full flex items-center justify-center shadow-[4px_6px_0px_#74281A]`}
                          onClick={() => handleToggleFavorite(book.id)}
                          aria-label={isAuthenticated && isFavorite(book.id) ? "從收藏移除" : "加入收藏"}
                        >
                          <Heart 
                            className={`w-6 h-6 ${
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
                      <div className="flex gap-2 mb-1">
                        <span className="px-4 py-1 rounded-full text-sm font-semibold bg-[#F3FAF8] text-[#295C58]">
                          {book.categoryName}
                        </span>
                        <span className="px-4 py-1 rounded-full text-sm font-semibold bg-[#FEF5EE] text-[#B4371A]">
                          {book.ageRangeName}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/products/${book.id}`}>
                        <h3 className="text-xl text-[#2F726D] hover:text-[#E8652B] transition-colors duration-300 cursor-pointer ">
                          {book.title}
                        </h3>
                      </Link>

                      {/* Author & Publisher */}
                      <div className="flex text-sm text-gray-700">
                        <span className="mr-2">{book.author}</span>
                        <span>{book.publisher}</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-end">
                        <motion.span 
                          className="text-xl text-[#E8652B] "
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          ${book.discountPrice ? book.discountPrice : book.price}
                        </motion.span>
                        {book.discountPrice && (
                          <span className="ml-2 text-sm text-gray-700 line-through">原價 NT${book.price}</span>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Right Arrow */}
            <motion.button 
              className="absolute -right-10 top-1/4 transform -translate-y-1/2 w-20 h-20 bg-[#E8652B] rounded-full shadow-[4px_6px_0px_#74281A] flex items-center justify-center z-10 origin-center"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextClick}
              aria-label="下一頁"
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ChevronRight className="w-10 h-10 text-white" />
            </motion.button>
          </div>
        )}
      </div>
      </div>
    </section>
  )
}
