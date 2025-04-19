"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function FeaturedBook() {
  const featuredBooks = [
    {
      id: 1,
      title: "音樂森林的秘密",
      author: "林小音",
      ageRange: "5-8歲",
      description:
        "一個關於音樂和友誼的奇妙故事！小明在森林裡發現了會唱歌的樹木，他和森林的動物們一起組成了一個特別的樂團。這本書將帶領孩子們探索音樂的魔力，同時學習友誼和合作的重要性。",
      image: "/images/book_05.png",
    },
    {
      id: 2,
      title: "海底探險記",
      author: "王海洋",
      ageRange: "6-9歲",
      description:
        "跟隨小魚阿奇的冒險，探索神秘的海底世界！在這趟奇妙的旅程中，阿奇將遇見各種奇特的海洋生物，學習關於海洋保護的重要知識，並且發現自己勇敢面對挑戰的能力。",
      image: "/images/book_05.png",
    },
    {
      id: 3,
      title: "小小科學家",
      author: "張博士",
      ageRange: "7-10歲",
      description:
        "透過有趣的實驗和生動的插圖，這本書將科學概念簡化為孩子們能理解的內容。從簡單的化學反應到基礎物理原理，小讀者們將在遊戲中學習科學，培養對自然世界的好奇心。",
      image: "/images/book_05.png",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredBooks.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredBooks.length) % featuredBooks.length)
  }

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-8">
      <h2 className="section-title">
        <Image
          src="/images/icon/icon_book.png"
          alt="Icon"
          width={24}
          height={24}
          className="mr-2"
        />
        本月強推新書
      </h2>

      <div className="relative">
        <button
          onClick={prevSlide}
          className="carousel-button left-0 ml-2 w-10 h-10 bg-[#E8652B] shadow-[4px_6px_0px_#74281A]"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="bg-[url('/images/open_book.png')] bg-contain bg-center bg-no-repeat py-8">
          <div className="grid md:grid-cols-2 gap-4 px-8">
            <div className="flex justify-center">
              <div className="relative w-64 h-80">
                <Image
                  src={featuredBooks[currentIndex].image || "/placeholder.svg"}
                  alt={featuredBooks[currentIndex].title}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center p-4">
              <h3 className="text-xl font-bold text-amber-800 mb-2">{featuredBooks[currentIndex].title}</h3>
              <p className="text-sm text-gray-600 mb-1">作者：{featuredBooks[currentIndex].author}</p>
              <p className="text-sm text-gray-600 mb-4">適合年齡：{featuredBooks[currentIndex].ageRange}</p>

              <p className="text-sm text-gray-700 mb-6">{featuredBooks[currentIndex].description}</p>

              <div className="flex space-x-3">
                <Link href={`/books/${featuredBooks[currentIndex].id}`} className="primary-button">
                  立即購買
                </Link>
                <Link href={`/books/${featuredBooks[currentIndex].id}/details`} className="secondary-button">
                  了解更多
                </Link>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={nextSlide}
          className="carousel-button right-0 mr-2 w-10 h-10 bg-[#E8652B] shadow-[4px_6px_0px_#74281A]"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots indicator */}
        <div className="flex justify-center mt-4">
          {featuredBooks.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 mx-1 rounded-full ${currentIndex === index ? "bg-[#E8652B]" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
