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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalReviews)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalReviews) % totalReviews)
  }

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Get the previous, current, and next indices with wrap-around
  const getPrevIndex = (index: number) => (index - 1 + totalReviews) % totalReviews
  const getNextIndex = (index: number) => (index + 1) % totalReviews

  // 評分星星渲染函數
  const renderStars = (rating: number, size: "sm" | "md" | "lg") => {
    const starSizes = {
      sm: "w-5 h-5",
      md: "w-6 h-6",
      lg: "w-7 h-7"
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
  const renderUserIcon = (authorIndex: number, size: "sm" | "md") => {
    const iconSizes = {
      sm: "w-10 h-10",
      md: "w-12 h-12"
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
        <span className={size === "sm" ? "text-xs" : "text-sm"}>{reviews[authorIndex].author}</span>
      </div>
    );
  };

  return (
    <section className="py-16 bg-[#F3FAF8] rounded-[64px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex justify-center items-center mb-16">
          <div className="w-12 h-12 mr-4">
            <Image
              src="/images/home/title_icon_review.png"
              alt="書籍好評"
              width={48}
              height={48}
            />
          </div>
          <h2 className="text-4xl font-normal text-[#2F726D] tracking-widest font-['jf-openhuninn-2.0']">書籍好評</h2>
        </div>

        {/* Reviews Carousel */}
        <div className="relative" ref={carouselRef}>
          <div className="flex justify-center items-center gap-6 h-[480px]">
            {/* Previous Review (Left) */}
            <div className="w-[356px] h-[356px] relative flex flex-col items-center z-10 opacity-50">
              <div className="absolute inset-0">
                <Image
                  src="/images/home/reviews_card.png"
                  alt="卡片背景"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* 評分星星 - 頂部 */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10">
                {renderStars(reviews[getPrevIndex(currentIndex)].rating, "sm")}
              </div>
              
              {/* 書籍圖片 */}
              <div className="mt-16 relative w-[110px] h-[110px] bg-white border-4 border-[#EC824B] border-3 rounded-[12px] p-1 z-10">
                <Image
                  src={reviews[getPrevIndex(currentIndex)].image}
                  alt={reviews[getPrevIndex(currentIndex)].title}
                  width={110}
                  height={110}
                  className="object-cover"
                />
              </div>
              
              {/* 標題 */}
              <h3 className="mt-3 text-lg font-['jf-openhuninn-2.0'] z-10">
                {reviews[getPrevIndex(currentIndex)].title}
              </h3>
              
              {/* 內容 */}
              <p className="px-6 mt-2 text-xs tracking-wide leading-tight line-clamp-4 text-center z-10 min-h-[80px]">
                {reviews[getPrevIndex(currentIndex)].content}
              </p>
              
              {/* 用戶信息 */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
                {renderUserIcon(getPrevIndex(currentIndex), "sm")}
              </div>
            </div>

            {/* Current Review (Center) */}
            <div className="w-[480px] h-[480px] relative flex flex-col items-center z-20">
              <div className="absolute inset-0">
                <Image
                  src="/images/home/reviews_card.png"
                  alt="卡片背景"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* 評分星星 - 頂部 */}
              <div className="absolute top-7 left-1/2 transform -translate-x-1/2 z-10">
                {renderStars(reviews[currentIndex].rating, "lg")}
              </div>
              
              {/* 書籍圖片 */}
              <div className="mt-24 relative w-[150px] h-[150px] bg-white border-4 border-[#EC824B] border-3 rounded-[12px] p-1 z-10">
                <Image
                  src={reviews[currentIndex].image}
                  alt={reviews[currentIndex].title}
                  width={150}
                  height={150}
                  className="object-cover"
                />
              </div>
              
              {/* 標題 */}
              <h3 className="mt-4 text-2xl font-['jf-openhuninn-2.0'] z-10">
                {reviews[currentIndex].title}
              </h3>
              
              {/* 內容 */}
              <p className="px-12 mt-3 text-sm tracking-wide leading-relaxed text-center z-10 min-h-[90px]">
                {reviews[currentIndex].content}
              </p>
              
              {/* 用戶信息 */}
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10">
                {renderUserIcon(currentIndex, "md")}
              </div>
            </div>

            {/* Next Review (Right) */}
            <div className="w-[356px] h-[356px] relative flex flex-col items-center z-10 opacity-50">
              <div className="absolute inset-0">
                <Image
                  src="/images/home/reviews_card.png"
                  alt="卡片背景"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* 評分星星 - 頂部 */}
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-10">
                {renderStars(reviews[getNextIndex(currentIndex)].rating, "sm")}
              </div>
              
              {/* 書籍圖片 */}
              <div className="mt-16 relative w-[110px] h-[110px] bg-white border-4 border-[#EC824B] border-3 rounded-[12px] p-1 z-10">
                <Image
                  src={reviews[getNextIndex(currentIndex)].image}
                  alt={reviews[getNextIndex(currentIndex)].title}
                  width={110}
                  height={110}
                  className="object-cover"
                />
              </div>
              
              {/* 標題 */}
              <h3 className="mt-3 text-lg font-['jf-openhuninn-2.0'] z-10">
                {reviews[getNextIndex(currentIndex)].title}
              </h3>
              
              {/* 內容 */}
              <p className="px-6 mt-2 text-xs tracking-wide leading-tight line-clamp-4 text-center z-10 min-h-[80px]">
                {reviews[getNextIndex(currentIndex)].content}
              </p>
              
              {/* 用戶信息 */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
                {renderUserIcon(getNextIndex(currentIndex), "sm")}
              </div>
            </div>
          </div>

          {/* 裝飾性動物圖片 - 老鼠 */}
          <div className="absolute left-[320px] bottom-0 z-30">
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
            className="absolute -left-10 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-[#E8652B] rounded-full shadow-[4px_6px_0px_rgba(116,40,26,1)] flex items-center justify-center z-10"
            aria-label="前一個評論"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextSlide}
            className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-[#E8652B] rounded-full shadow-[4px_6px_0px_rgba(116,40,26,1)] flex items-center justify-center z-10"
            aria-label="下一個評論"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 mx-1 rounded-full ${currentIndex === index ? "bg-[#E8652B]" : "bg-gray-300"}`}
                aria-label={`跳至第 ${index + 1} 個評論`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
