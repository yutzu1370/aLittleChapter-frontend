"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

export default function BookReviews() {
  const reviews = [
    {
      id: 1,
      title: "My Animal Friends",
      author: "吳小姐",
      content: "色彩鮮明、節奏輕快的互動繪本，動物角色親切可愛，適合親子共讀，引導幼兒認識自然與基本情緒。",
      rating: 4,
      image: "/images/home/sec04_book1.png"
    },
    {
      id: 2,
      title: "失落神殿的冒險",
      author: "陳先生",
      content: "奇幻冒險故事，帶領孩子探索神秘遺跡，激發想像力與勇氣，情節緊湊刺激，是小小冒險家的最佳選擇。",
      rating: 4,
      image: "/images/home/sec04_book2.png"
    },
    {
      id: 3,
      title: "貓公主",
      author: "林小姐",
      content: "一場關於成長與友誼的童話旅程，貓公主勇敢又可愛，讓孩子學會同理心與分享，故事溫馨有趣，令人喜愛。",
      rating: 5,
      image: "/images/home/sec04_book3.png"
    },
  ]

  // 為每個評論固定分配用戶頭像，避免水合錯誤
  const userIcons = [
    "/images/user_icon/user_icon_1.png",
    "/images/user_icon/user_icon_3.png",
    "/images/user_icon/user_icon_4.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0)
  const totalReviews = reviews.length
  const carouselRef = useRef<HTMLDivElement>(null)

  // 使用 requestAnimationFrame 優化輪播切換，避免強制重排
  const nextSlide = () => {
    requestAnimationFrame(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalReviews)
    })
  }

  const prevSlide = () => {
    requestAnimationFrame(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + totalReviews) % totalReviews)
    })
  }

  // 記憶化索引計算，避免重複計算
  const prevIndex = useMemo(() => (currentIndex - 1 + totalReviews) % totalReviews, [currentIndex, totalReviews])
  const nextIndex = useMemo(() => (currentIndex + 1) % totalReviews, [currentIndex, totalReviews])

  // Auto slide every 5 seconds - 使用 requestAnimationFrame 優化
  useEffect(() => {
    let animationFrameId: number
    const interval = setInterval(() => {
      animationFrameId = requestAnimationFrame(nextSlide)
    }, 5000)
    
    return () => {
      clearInterval(interval)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  // 評分星星渲染函數 - 使用 useMemo 記憶化
  const renderStars = useMemo(() => {
    return (rating: number, size: "sm" | "md" | "lg") => {
      const starSizes = {
        sm: "w-4 h-4 sm:w-5 sm:h-5",
        md: "w-5 h-5 sm:w-6 sm:h-6",
        lg: "w-6 h-6 sm:w-7 sm:h-7"
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
  }, []);

  // 用戶頭像渲染函數 - 使用 useMemo 記憶化
  const renderUserIcon = useMemo(() => {
    return (authorIndex: number, size: "sm" | "md") => {
      const iconSizes = {
        sm: "w-8 h-8 sm:w-10 sm:h-10",
        md: "w-10 h-10 sm:w-12 sm:h-12"
      };
      
      return (
        <div className="flex items-center gap-2">
          <div className={`${iconSizes[size]} rounded-full overflow-hidden relative`}>
            <Image 
              src={userIcons[authorIndex]} 
              alt={reviews[authorIndex].author} 
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <span className={size === "sm" ? "text-xs sm:text-sm" : "text-sm sm:text-base"}>{reviews[authorIndex].author}</span>
        </div>
      );
    };
  }, [reviews, userIcons]);

  // 記憶化輪播卡片，避免不必要的重新渲染
  const PrevReviewCard = useMemo(() => (
    <div className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] lg:w-[356px] lg:h-[356px] relative flex flex-col items-center z-10 opacity-50">
      <div className="absolute inset-0">
        <Image
          src="/images/home/reviews_card.png"
          alt="卡片背景"
          fill
          className="object-contain"
          priority
        />
      </div>
      
      <div className="absolute top-3 sm:top-4 lg:top-5 left-1/2 transform -translate-x-1/2 z-10">
        {renderStars(reviews[prevIndex].rating, "sm")}
      </div>
      
      <div className="mt-10 sm:mt-12 lg:mt-16 relative w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] lg:w-[110px] lg:h-[110px] bg-white border-2 sm:border-3 lg:border-4 border-[#EC824B] rounded-[8px] sm:rounded-[10px] lg:rounded-[12px] p-1 z-10">
        <Image
          src={reviews[prevIndex].image}
          alt={reviews[prevIndex].title}
          width={110}
          height={110}
          className="object-cover w-full h-full"
        />
      </div>
      
      <h3 className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg font-['jf-openhuninn-2.0'] z-10 text-center">
        {reviews[prevIndex].title}
      </h3>
      
      <p className="px-4 sm:px-5 lg:px-6 mt-1 sm:mt-2 text-xs sm:text-xs lg:text-xs tracking-wide leading-tight line-clamp-3 sm:line-clamp-4 text-center z-10 min-h-[60px] sm:min-h-[70px] lg:min-h-[80px]">
        {reviews[prevIndex].content}
      </p>
      
      <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        {renderUserIcon(prevIndex, "sm")}
      </div>
    </div>
  ), [prevIndex, renderStars, renderUserIcon, reviews]);

  const CurrentReviewCard = useMemo(() => (
    <div className="w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] lg:w-[480px] lg:h-[480px] relative flex flex-col items-center z-20">
      <div className="absolute inset-0">
        <Image
          src="/images/home/reviews_card.png"
          alt="卡片背景"
          fill
          className="object-contain"
          priority
        />
      </div>
      
      <div className="absolute top-4 sm:top-5 lg:top-7 left-1/2 transform -translate-x-1/2 z-10">
        {renderStars(reviews[currentIndex].rating, "lg")}
      </div>
      
      <div className="mt-16 sm:mt-20 lg:mt-24 relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] lg:w-[150px] lg:h-[150px] bg-white border-3 sm:border-3 lg:border-4 border-[#EC824B] rounded-[10px] sm:rounded-[11px] lg:rounded-[12px] p-1 z-10">
        <Image
          src={reviews[currentIndex].image}
          alt={reviews[currentIndex].title}
          width={150}
          height={150}
          className="object-cover w-full h-full"
        />
      </div>
      
      <h3 className="mt-3 sm:mt-3 lg:mt-4 text-lg sm:text-xl lg:text-2xl font-['jf-openhuninn-2.0'] z-10 text-center">
        {reviews[currentIndex].title}
      </h3>
      
      <p className="px-6 sm:px-8 lg:px-12 mt-2 sm:mt-2 lg:mt-3 text-xs sm:text-sm lg:text-sm tracking-wide leading-relaxed text-center z-10 min-h-[70px] sm:min-h-[80px] lg:min-h-[90px]">
        {reviews[currentIndex].content}
      </p>
      
      <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 left-1/2 transform -translate-x-1/2 z-10">
        {renderUserIcon(currentIndex, "md")}
      </div>
    </div>
  ), [currentIndex, renderStars, renderUserIcon, reviews]);

  const NextReviewCard = useMemo(() => (
    <div className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] lg:w-[356px] lg:h-[356px] relative flex flex-col items-center z-10 opacity-50">
      <div className="absolute inset-0">
        <Image
          src="/images/home/reviews_card.png"
          alt="卡片背景"
          fill
          className="object-contain"
          priority
        />
      </div>
      
      <div className="absolute top-3 sm:top-4 lg:top-5 left-1/2 transform -translate-x-1/2 z-10">
        {renderStars(reviews[nextIndex].rating, "sm")}
      </div>
      
      <div className="mt-10 sm:mt-12 lg:mt-16 relative w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] lg:w-[110px] lg:h-[110px] bg-white border-2 sm:border-3 lg:border-4 border-[#EC824B] rounded-[8px] sm:rounded-[10px] lg:rounded-[12px] p-1 z-10">
        <Image
          src={reviews[nextIndex].image}
          alt={reviews[nextIndex].title}
          width={110}
          height={110}
          className="object-cover w-full h-full"
        />
      </div>
      
      <h3 className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg font-['jf-openhuninn-2.0'] z-10 text-center">
        {reviews[nextIndex].title}
      </h3>
      
      <p className="px-4 sm:px-5 lg:px-6 mt-1 sm:mt-2 text-xs sm:text-xs lg:text-xs tracking-wide leading-tight line-clamp-3 sm:line-clamp-4 text-center z-10 min-h-[60px] sm:min-h-[70px] lg:min-h-[80px]">
        {reviews[nextIndex].content}
      </p>
      
      <div className="absolute bottom-6 sm:bottom-8 lg:bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        {renderUserIcon(nextIndex, "sm")}
      </div>
    </div>
  ), [nextIndex, renderStars, renderUserIcon, reviews]);

  // 記憶化點指示器，避免不必要的重新渲染
  const DotsIndicator = useMemo(() => (
    <div className="flex justify-center mt-6 sm:mt-8">
      {reviews.map((_, index) => (
        <button
          key={index}
          onClick={() => requestAnimationFrame(() => setCurrentIndex(index))}
          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 mx-1 rounded-full ${currentIndex === index ? "bg-[#E8652B]" : "bg-gray-300"}`}
          aria-label={`跳至第 ${index + 1} 個評論`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              requestAnimationFrame(() => setCurrentIndex(index));
            }
          }}
        />
      ))}
    </div>
  ), [currentIndex, reviews]);

  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-[#F3FAF8] rounded-[32px] sm:rounded-[48px] lg:rounded-[64px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
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

        {/* Reviews Carousel */}
        <div className="relative" ref={carouselRef}>
          <div className="flex justify-center items-center gap-3 sm:gap-4 lg:gap-6 h-[300px] sm:h-[380px] lg:h-[480px] overflow-hidden">
            {/* Previous Review (Left) */}
            {PrevReviewCard}

            {/* Current Review (Center) */}
            {CurrentReviewCard}

            {/* Next Review (Right) */}
            {NextReviewCard}
          </div>

          {/* 裝飾性動物圖片 - 老鼠 - 隱藏在小螢幕 */}
          <div className="hidden lg:block absolute left-[320px] bottom-0 z-30">
            <Image
              src="/images/home/reviews_Mouse.png"
              alt="裝飾性老鼠圖片"
              width={150}
              height={150}
              className="object-contain"
            />
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={prevSlide}
            className="absolute -left-6 sm:-left-8 lg:-left-10 top-1/2 transform -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#E8652B] rounded-full shadow-[3px_4px_0px_rgba(116,40,26,1)] sm:shadow-[4px_6px_0px_rgba(116,40,26,1)] flex items-center justify-center z-10 hover:scale-105 transition-transform active:scale-95"
            aria-label="前一個評論"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                prevSlide();
              }
            }}
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            className="absolute -right-6 sm:-right-8 lg:-right-10 top-1/2 transform -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#E8652B] rounded-full shadow-[3px_4px_0px_rgba(116,40,26,1)] sm:shadow-[4px_6px_0px_rgba(116,40,26,1)] flex items-center justify-center z-10 hover:scale-105 transition-transform active:scale-95"
            aria-label="下一個評論"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                nextSlide();
              }
            }}
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
          </button>

          {/* Dots indicator */}
          {DotsIndicator}
        </div>
      </div>
    </section>
  )
}
