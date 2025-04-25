"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BookTag {
  label: string
  color: string
  bg: string
}

interface FeaturedBookItem {
  id: number
  title: string
  author: string
  publisher: string
  ageRange: string
  description: string
  image: string
  tags: BookTag[]
}

const featuredBooks: FeaturedBookItem[] = [
  {
    id: 1,
    title: "音樂森林的秘密",
    author: "林依琴",
    publisher: "藝術之聲出版",
    ageRange: "7-12歲",
    description:
      "一位熱愛音樂的女孩進入神秘森林，發現這裡住著來自世界各地的音樂家，他們用不同樂器交流，最後攜手創造最美的樂章。",
    image: "/images/book_05.png",
    tags: [
      { label: "藝術啟蒙", color: "text-[#295C58]", bg: "bg-[#F3FAF8]" },
      { label: "7-12歲", color: "text-[#B4371A]", bg: "bg-[#FEF5EE]" },
    ],
  },
  {
    id: 2,
    title: "海底探險記",
    author: "王海洋",
    publisher: "海洋之心",
    ageRange: "6-9歲",
    description:
      "跟隨小魚阿奇的冒險，探索神秘的海底世界！在這趟奇妙的旅程中，阿奇將遇見各種奇特的海洋生物，學習關於海洋保護的重要知識，並且發現自己勇敢面對挑戰的能力。",
    image: "/images/book_05.png",
    tags: [
      { label: "知識啟蒙", color: "text-[#295C58]", bg: "bg-[#F3FAF8]" },
      { label: "6-9歲", color: "text-[#B4371A]", bg: "bg-[#FEF5EE]" },
    ],
  },
  {
    id: 3,
    title: "小小科學家",
    author: "張博士",
    publisher: "科學小天地",
    ageRange: "7-10歲",
    description:
      "透過有趣的實驗和生動的插圖，這本書將科學概念簡化為孩子們能理解的內容。從簡單的化學反應到基礎物理原理，小讀者們將在遊戲中學習科學，培養對自然世界的好奇心。",
    image: "/images/book_05.png",
    tags: [
      { label: "科學啟蒙", color: "text-[#295C58]", bg: "bg-[#F3FAF8]" },
      { label: "7-10歲", color: "text-[#B4371A]", bg: "bg-[#FEF5EE]" },
    ],
  },
]

export default function FeaturedBook() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredBooks.length)
  }
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredBooks.length) % featuredBooks.length)
  }
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const book = featuredBooks[currentIndex]

  return (
    <section className="bg-[#F3FAF8]  px-2 md:px-8 py-8 md:py-12 flex flex-col items-center gap-10 md:gap-14 relative overflow-hidden">
      {/* 標題區 */}
      <div className="flex items-center gap-4 mb-2 md:mb-4">
        <Image
          src="/images/icon/icon_book.png"
          alt="Icon"
          width={48}
          height={48}
          className="w-10 h-10 md:w-12 md:h-12"
        />
        <h2 className="font-[jf-openhuninn-2.0] text-[2.25rem] md:text-[2.5rem] text-[#2F726D] tracking-[0.05em] leading-tight">
          本月亮點新書
        </h2>
      </div>

      {/* 輪播區 */}
      <div className="relative w-full max-w-[1100px] flex items-center justify-center min-h-[420px] md:min-h-[540px]">
        {/* 左箭頭 */}
        <button
          onClick={prevSlide}
          aria-label="上一筆"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-[#E8652B] rounded-full shadow-[4px_6px_0px_#74281A] w-12 h-12 md:w-16 md:h-16 flex items-center justify-center hover:bg-[#FEF5EE] transition"
        >
          <ChevronLeft className="w-7 h-7 text-[#E8652B]" />
        </button>

        {/* 書本內容卡片 */}
        <div className="flex flex-col md:flex-row flex-1 bg-[url('/images/open_book.png')] bg-cover bg-center min-h-[360px] md:min-h-[550px]">
          {/* 書本圖片 */}
          <div className="flex items-center justify-center basis-[50%] min-w-[220px] p-6 md:p-10 translate-x-2 md:translate-x-4">
            <div className="relative w-48 h-48 md:w-96 md:h-96">
              <Image
                src={book.image}
                alt={book.title}
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 192px, 288px"
                priority
              />
            </div>
          </div>
          {/* 右側內容 */}
          <div className="flex flex-col justify-center basis-[50%] gap-4 md:gap-2 px-4 md:pl-12 pr-24 py-6 md:py-12">
            <h3 className="font-[jf-openhuninn-2.0] text-[1.5rem] md:text-[2.25rem] text-[#2F726D] leading-tight mb-1 md:mb-2">
              {book.title}
            </h3>
            <div className="flex flex-wrap gap-2 text-sm md:text-base text-[#4F4F4F] mb-1">
              <span>{book.author}</span>
              <span className="hidden md:inline">|</span>
              <span>{book.publisher}</span>
            </div>
            <div className="flex gap-2 mb-2">
              {book.tags.map((tag, i) => (
                <span
                  key={tag.label + i}
                  className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${tag.bg} ${tag.color}`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
            <p className="text-base md:text-lg h-[120px] text-[#121212] mb-2 md:mb-4 leading-relaxed">
              {book.description}
            </p>
            <div className="flex gap-3 md:gap-4 mt-2">
              <Link
                href={`/books/${book.id}`}
                className="bg-white border-2 border-[#E8652B] text-[#E8652B] font-semibold rounded-full px-5 py-2 md:px-6 md:py-3 shadow-[4px_6px_0px_#74281A] hover:bg-[#FEF5EE] transition text-sm md:text-base"
              >
                立即購買
              </Link>
              <Link
                href={`/books/${book.id}/details`}
                className="bg-white border-2 border-[#E8652B] text-[#E8652B] font-semibold rounded-full px-5 py-2 md:px-6 md:py-3 shadow-[4px_6px_0px_#74281A] hover:bg-[#FEF5EE] transition text-sm md:text-base"
              >
                了解更多
              </Link>
            </div>
          </div>
        </div>

        {/* 右箭頭 */}
        <button
          onClick={nextSlide}
          aria-label="下一筆"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-[#E8652B] rounded-full shadow-[4px_6px_0px_#74281A] w-12 h-12 md:w-16 md:h-16 flex items-center justify-center hover:bg-[#FEF5EE] transition"
        >
          <ChevronRight className="w-7 h-7 text-[#E8652B]" />
        </button>

        {/* 右下角插圖（小老鼠） */}
        <Image
          src="/images/animals/animals_mouse_home.png"
          alt="小老鼠"
          width={160}
          height={160}
          className="hidden md:block absolute right-8 bottom-4 w-32 md:w-40 pointer-events-none select-none"
        />
      </div>

      {/* 指示點 */}
      <div className="flex justify-center items-center gap-3 mt-2">
        {featuredBooks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`切換到第${index + 1}本書`}
            className={`w-4 h-4 rounded-full border-none transition-all duration-200 ${
              currentIndex === index
                ? "bg-[#2F726DA3] scale-125"
                : "bg-[#D1D1D1] opacity-80"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
