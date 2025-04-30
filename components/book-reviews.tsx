"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

export default function BookReviews() {
  const reviews = [
    {
      id: 1,
      title: "我的動物朋友",
      author: "吳小姐",
      content: "EduPlay 的產品選擇令人印象深刻。每一款玩具都經過嚴謹的教育理念檢視，能夠真正做到寓教於樂。",
      rating: 5,
      image: "https://images.unsplash.com/photo-1633477189729-9290b3261d0a?q=80&w=200&h=200&auto=format&fit=crop",
      avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=24&h=24&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "海底探險",
      author: "林先生",
      content: "孩子非常喜歡這本書，插圖精美，內容淺顯易懂，很適合培養孩子對海洋生物的興趣。",
      rating: 4,
      image: "https://images.unsplash.com/photo-1682686581580-d99b0230064e?q=80&w=200&h=200&auto=format&fit=crop",
      avatar: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=24&h=24&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "太空旅行",
      author: "張小姐",
      content: "這本書讓孩子對宇宙產生了濃厚的興趣，內容深入淺出，很適合啟發孩子的科學思維。",
      rating: 5,
      image: "https://images.unsplash.com/photo-1636955816868-fcb881e57954?q=80&w=200&h=200&auto=format&fit=crop",
      avatar: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=24&h=24&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "恐龍世界",
      author: "王先生",
      content: "書中的恐龍知識非常豐富，孩子每天都要我讀給他聽，是我們家的最愛！",
      rating: 5,
      image: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=200&h=200&auto=format&fit=crop",
      avatar: "https://images.unsplash.com/photo-1568572933382-74d440642117?q=80&w=24&h=24&auto=format&fit=crop",
    },
    {
      id: 5,
      title: "森林冒險",
      author: "李小姐",
      content: "故事情節生動有趣，插圖精美，孩子非常喜歡，每晚都要求讀這本書才肯睡覺。",
      rating: 4,
      image: "/images/home/book_review_1.png",
      avatar: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=24&h=24&auto=format&fit=crop",
    },
  ]

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

  return (
    <section className="py-16 bg-[#F3FAF8] rounded-[64px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex justify-center items-center mb-16">
          <div className="w-12 h-12 mr-4">
            <Image
              src="/images/home/title_icon_review.png"
              alt="Icon"
              width={48}
              height={48}
            />
          </div>
          <h2 className="text-4xl font-normal text-[#2F726D] tracking-widest font-['jf-openhuninn-2.0']">書籍好評</h2>
        </div>

        {/* Reviews Carousel */}
        <div className="relative" ref={carouselRef}>
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute -left-10 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-[#E8652B] rounded-full shadow-[4px_8px_0px_rgba(0,0,0,0.25)] flex items-center justify-center z-10"
          >
            <ChevronLeft className="w-10 h-10 text-white" />
          </button>

          <div className="flex justify-center items-center gap-6 h-[480px]">
            {/* Previous Review (Smaller) */}
            <div className="w-[356px] h-[356px] bg-[#FFF9E5] opacity-60 shadow-[4px_8px_0px_rgba(0,0,0,0.25)] rounded-lg pt-16 flex flex-col items-center">
              <div className="w-[136px] h-[136px] bg-white border-2 border-[#EC824B] rounded-lg p-2">
                <div className="relative w-full h-full">
                  <Image
                    src={reviews[getPrevIndex(currentIndex)].image || "/placeholder.svg"}
                    alt={reviews[getPrevIndex(currentIndex)].title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="px-4 mt-3 text-center">
                <h3 className="text-xl font-['jf-openhuninn-2.0']">{reviews[getPrevIndex(currentIndex)].title}</h3>
                <p className="text-xs mt-2">{reviews[getPrevIndex(currentIndex)].content}</p>
                <div className="flex items-center justify-center mt-2 gap-1.5">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={reviews[getPrevIndex(currentIndex)].avatar || "/placeholder.svg"}
                      alt="User"
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs">{reviews[getPrevIndex(currentIndex)].author}</span>
                </div>
              </div>

              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-7 h-7 ${
                      i < reviews[getPrevIndex(currentIndex)].rating ? "fill-[#FBE84A]" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Review (Larger) */}
            <div className="w-[480px] h-[480px] bg-[#FFF9E5] shadow-[8px_12px_0px_rgba(0,0,0,0.25)] rounded-lg pt-24 flex flex-col items-center z-10">
              <div className="w-[176px] h-[176px] bg-white border-4 border-[#EC824B] rounded-xl p-2">
                <div className="relative w-full h-full">
                  <Image
                    src={reviews[currentIndex].image || "/placeholder.svg"}
                    alt={reviews[currentIndex].title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="px-6 mt-4 text-center">
                <h3 className="text-2xl font-['jf-openhuninn-2.0']">{reviews[currentIndex].title}</h3>
                <p className="text-lg mt-2">{reviews[currentIndex].content}</p>
                <div className="flex items-center justify-center mt-2 gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={reviews[currentIndex].avatar || "/placeholder.svg"}
                      alt="User"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-base">{reviews[currentIndex].author}</span>
                </div>
              </div>

              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-10 h-10 ${i < reviews[currentIndex].rating ? "fill-[#FBE84A]" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>

            {/* Next Review (Smaller) */}
            <div className="w-[356px] h-[356px] bg-[#FFF9E5] opacity-60 shadow-[4px_8px_0px_rgba(0,0,0,0.25)] rounded-lg pt-16 flex flex-col items-center">
              <div className="w-[136px] h-[136px] bg-white border-2 border-[#EC824B] rounded-lg p-2">
                <div className="relative w-full h-full">
                  <Image
                    src={reviews[getNextIndex(currentIndex)].image || "/placeholder.svg"}
                    alt={reviews[getNextIndex(currentIndex)].title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="px-4 mt-3 text-center">
                <h3 className="text-xl font-['jf-openhuninn-2.0']">{reviews[getNextIndex(currentIndex)].title}</h3>
                <p className="text-xs mt-2">{reviews[getNextIndex(currentIndex)].content}</p>
                <div className="flex items-center justify-center mt-2 gap-1.5">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={reviews[getNextIndex(currentIndex)].avatar || "/placeholder.svg"}
                      alt="User"
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs">{reviews[getNextIndex(currentIndex)].author}</span>
                </div>
              </div>

              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-7 h-7 ${
                      i < reviews[getNextIndex(currentIndex)].rating ? "fill-[#FBE84A]" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-[#E8652B] rounded-full shadow-[4px_8px_0px_rgba(0,0,0,0.25)] flex items-center justify-center z-10"
          >
            <ChevronRight className="w-10 h-10 text-white" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 mx-1 rounded-full ${currentIndex === index ? "bg-[#E8652B]" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
