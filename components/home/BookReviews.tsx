"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import type { SwiperRef } from 'swiper/react'
import { getAllReviewsApi, ReviewData } from "@/lib/api/review"

// 評論資料介面
interface ReviewItem {
  id: number;
  title: string;
  author: string;
  content: string;
  rating: number;
  image: string;
  userAvatar: string;
}

// 自定義 Swiper 樣式
const swiperStyles = `
  .swiper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 10px;
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

export default function BookReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<SwiperRef | null>(null);

  // 獲取評論資料
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getAllReviewsApi();

        if (!response.status || !response.data) {
          throw new Error(response.message || '獲取評論失敗');
        }

        // 轉換 API 資料格式
        const transformedReviews: ReviewItem[] = response.data.reviews.map((review: ReviewData, index: number) => ({
          id: index + 1,
          title: review.productTitle,
          author: review.username,
          content: review.content,
          rating: review.rating,
          image: review.productImageUrl,
          userAvatar: review.userAvatar || "/images/user_icon/user_icon_3.png"
        }));

        setReviews(transformedReviews);
      } catch (err) {
       
        setError('載入評論失敗');
        
        // 如果 API 失敗，使用預設資料
        const defaultReviews: ReviewItem[] = [
          {
            id: 1,
            title: "My Animal Friends",
            author: "吳小姐",
            content: "色彩鮮明、節奏輕快的互動繪本，動物角色親切可愛，適合親子共讀，引導幼兒認識自然與基本情緒。",
            rating: 4,
            image: "/images/home/sec04_book1.png",
            userAvatar: "/images/user_icon/user_icon_1.png"
          },
          {
            id: 2,
            title: "失落神殿的冒險",
            author: "陳先生",
            content: "奇幻冒險故事，帶領孩子探索神秘遺跡，激發想像力與勇氣，情節緊湊刺激，是小小冒險家的最佳選擇。",
            rating: 4,
            image: "/images/home/sec04_book2.png",
            userAvatar: "/images/user_icon/user_icon_3.png"
          },
          {
            id: 3,
            title: "貓公主",
            author: "林小姐",
            content: "一場關於成長與友誼的童話旅程，貓公主勇敢又可愛，讓孩子學會同理心與分享，故事溫馨有趣，令人喜愛。",
            rating: 5,
            image: "/images/home/sec04_book3.png",
            userAvatar: "/images/user_icon/user_icon_4.png"
          },
        ];
        setReviews(defaultReviews);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // 動態添加自定義樣式
  useEffect(() => {
    const styleId = 'swiper-custom-styles-reviews';
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

  // 評分星星渲染函數
  const renderStars = (rating: number, size: "sm" | "md" | "lg") => {
    const starSizes = {
      sm: "w-3 h-3 sm:w-4 sm:h-4",
      md: "w-4 h-4 sm:w-5 sm:h-5",
      lg: "w-5 h-5 sm:w-6 sm:h-6"
    };
    
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${starSizes[size]} ${
              i < rating ? "fill-[#FBE84A] text-[#FBE84A]" : "text-[#FBE84A] opacity-50"
            }`}
          />
        ))}
      </div>
    );
  };

  // 用戶頭像渲染函數
  const renderUserIcon = (review: ReviewItem, size: "sm" | "md") => {
    const iconSizes = {
      sm: "w-6 h-6 sm:w-8 sm:h-8",
      md: "w-8 h-8 sm:w-10 sm:h-10"
    };
    
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <div className={`${iconSizes[size]} rounded-full overflow-hidden relative flex-shrink-0`}>
          <Image 
            src={review.userAvatar} 
            alt={`${review.author}的頭像`} 
            width={40}
            height={40}
            className="object-cover w-full h-full"
          />
        </div>
        <span className={`${size === "sm" ? "text-xs" : "text-sm"} text-gray-700`}>{review.author}</span>
      </div>
    );
  };

  // 處理上一張/下一張
  const handlePrevClick = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  // 如果正在載入或沒有評論資料，顯示載入狀態
  if (isLoading || reviews.length === 0) {
    return (
      <section className="py-12 sm:py-14 lg:py-16 bg-[#F3FAF8] rounded-[32px] sm:rounded-[48px] lg:rounded-[64px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center mb-12 sm:mb-14 lg:mb-16">
            <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 mr-3 sm:mr-4">
              <Image
                src="/images/home/title_icon_review.png"
                alt="書籍好評"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#2F726D] tracking-widest">書籍好評</h2>
          </div>
          <div className="flex justify-center items-center py-16">
            <div className="text-lg text-gray-600">
              {isLoading ? "載入評論中..." : "暫無評論資料"}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center py-16 px-6 gap-12 bg-[#F3FAF8] rounded-[64px]" style={{ minHeight: '720px' }}>
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Title */}
        <div className="flex justify-center items-center ">
          <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 mr-3 sm:mr-4">
            <Image
              src="/images/home/title_icon_review.png"
              alt="書籍好評"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#2F726D] tracking-widest">書籍好評</h2>
        </div>

        {/* Reviews Carousel */}
        <div className="relative flex justify-center items-center h-[500px] sm:h-[500px] lg:h-[600px]">
          {/* Swiper Container */}
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            slidesPerGroup={1}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 12,
                centeredSlides: true,
                slidesPerGroup: 1,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 16,
                centeredSlides: true,
                slidesPerGroup: 1,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
                centeredSlides: true,
                slidesPerGroup: 1,
              },
            }}
            className="!pb-6 sm:!pb-8 h-[450px] sm:h-[450px] lg:h-[550px] w-full max-w-6xl"
            ref={swiperRef}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                {({ isActive }) => (
                  <div className={`relative flex flex-col items-center transition-all duration-300 ${
                    isActive 
                      ? 'scale-100 opacity-100 z-20 h-full justify-center' 
                      : 'scale-90 opacity-70 z-10 h-full'
                  }`}>
                    {/* 非活動卡片的透明白色覆蓋 */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-white bg-opacity-30 rounded-[32px] z-30 pointer-events-none" />
                    )}
                    
                    {/* 卡片背景 */}
                    <div className="absolute inset-0">
                      <Image
                        src="/images/home/reviews_card.png"
                        alt="卡片背景"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    
                    {/* 卡片內容容器 - 限制在背景圖片範圍內 */}
                                          <div className="relative z-10 flex flex-col items-center justify-start w-full h-full pt-24 sm:pt-24 lg:pt-28 pb-8 px-4">
                        {/* 評分星星 */}
                        <div className="mb-4 sm:mb-4">
                          {renderStars(review.rating, isActive ? "md" : "sm")}
                        </div>
                      
                      {/* 書籍圖片 */}
                      <div className={`${
                        isActive 
                          ? 'w-[90px] h-[90px] sm:w-[100px] sm:h-[100px] lg:w-[110px] lg:h-[110px]' 
                          : 'w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] lg:w-[100px] lg:h-[100px]'
                      } relative bg-white border-2 border-[#EC824B] rounded-[8px] sm:rounded-[10px] p-1 mt-30 sm:mb-2 `}>
                        <Image
                          src={review.image}
                          alt={review.title}
                          width={120}
                          height={120}
                          className="object-cover w-full h-full rounded-[4px] sm:rounded-[6px]"
                        />
                      </div>
                      
                      {/* 書籍標題 */}
                      <h3 className={`${
                        isActive 
                          ? 'text-sm sm:text-base font-medium' 
                          : 'text-xs sm:text-sm font-medium'
                      } font-['jf-openhuninn-2.0'] text-center mb-2 line-clamp-2 px-2 max-w-[260px]`}>
                        {review.title}
                      </h3>
                      
                      {/* 評論內容 - 限制高度 */}
                      <div className="px-6 py-4 mb-2 max-w-[260px] h-[40px] sm:h-[50px] flex items-center justify-center">
                        <p className={`${
                          isActive 
                            ? 'text-xs' 
                            : 'text-xs'
                        } tracking-wide leading-tight text-center text-gray-700 line-clamp-3`}>
                          {review.content}
                        </p>
                      </div>
                      
                      {/* 用戶資訊 */}
                      <div className="flex-shrink-0">
                        {renderUserIcon(review, isActive ? "sm" : "sm")}
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 裝飾性動物圖片 - 老鼠 - 隱藏在小螢幕 - 固定位置 */}
          <div className="hidden lg:block absolute left-[280px] bottom-6 z-30">
            <Image
              src="/images/home/reviews_Mouse.png"
              alt="裝飾性老鼠圖片"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>

          {/* Left Arrow Button - 固定位置，基於容器中心 */}
          <button
            onClick={handlePrevClick}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#E8652B] rounded-full shadow-[3px_4px_0px_rgba(116,40,26,1)] sm:shadow-[4px_6px_0px_rgba(116,40,26,1)] flex items-center justify-center z-10 hover:scale-105 transition-transform active:scale-95"
            aria-label="前一個評論"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePrevClick();
              }
            }}
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
          </button>

          {/* Right Arrow Button - 固定位置，基於容器中心 */}
          <button
            onClick={handleNextClick}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#E8652B] rounded-full shadow-[3px_4px_0px_rgba(116,40,26,1)] sm:shadow-[4px_6px_0px_rgba(116,40,26,1)] flex items-center justify-center z-10 hover:scale-105 transition-transform active:scale-95"
            aria-label="下一個評論"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNextClick();
              }
            }}
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
          </button>
        </div>
      </div>
    </section>
  )
}
