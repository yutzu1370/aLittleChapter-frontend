"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"

export default function PopularBooks() {
  const popularBooks = [
    {
      id: 1,
      title: "料理小天才",
      author: "劉巧兒",
      publisher: "美味出版社",
      price: 199,
      originalPrice: 300,
      image: "https://images.unsplash.com/photo-1607103058027-4c5c6c73a424?q=80&w=354&h=354&auto=format&fit=crop",
      category: "健康飲食",
      ageRange: "5-7歲",
      tags: [
        { text: "精選", type: "primary" },
        { text: "熱銷", type: "accent" },
      ],
      isNew: true,
    },
    {
      id: 2,
      title: "宇宙探險家",
      author: "陳宇航",
      publisher: "星際出版社",
      price: 450,
      originalPrice: 600,
      image: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=354&h=354&auto=format&fit=crop",
      category: "科學啟蒙",
      ageRange: "7-10歲",
      tags: [
        { text: "精選", type: "primary" },
        { text: "新書", type: "accent" },
      ],
    },
    {
      id: 3,
      title: "稻草人的微笑",
      author: "陳宇航",
      publisher: "鄉野出版社",
      price: 350,
      originalPrice: 400,
      image: "https://images.unsplash.com/photo-1601370552761-d129028bd833?q=80&w=354&h=354&auto=format&fit=crop",
      category: "兒童文學",
      ageRange: "6-10歲",
      tags: [
        { text: "精選", type: "primary" },
        { text: "熱銷", type: "accent" },
      ],
      isHot: true,
    },
    {
      id: 4,
      title: "彩虹糖的秘密",
      author: "張大勇",
      publisher: "繽紛出版社",
      price: 250,
      originalPrice: 300,
      image: "https://images.unsplash.com/photo-1608541737042-87a12275d313?q=80&w=354&h=354&auto=format&fit=crop",
      category: "兒童文學",
      ageRange: "6-10歲",
      tags: [
        { text: "精選", type: "primary" },
        { text: "新書", type: "accent" },
      ],
    },
  ]

  const [activeTimeSlot, setActiveTimeSlot] = useState("12:00")

  return (
    <section className="py-16 bg-white">
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
          <h2 className="text-4xl font-normal text-[#2F726D] tracking-widest font-['jf-openhuninn-2.0']">限時搶購</h2>
        </div>

        {/* Countdown and Filters */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          {/* Countdown */}
          <div className="flex items-center">
            <div className="flex items-center justify-center w-16 h-12 bg-white border-4 border-gray-300 rounded-xl">
              <span className="text-[#3E8E87] text-2xl font-['jf-openhuninn-2.0']">01</span>
            </div>
            <span className="text-[#3E8E87] text-4xl mx-2 font-['Coiny']">:</span>
            <div className="flex items-center justify-center w-16 h-12 bg-white border-4 border-gray-300 rounded-xl">
              <span className="text-[#3E8E87] text-2xl font-['jf-openhuninn-2.0']">59</span>
            </div>
            <span className="text-[#3E8E87] text-4xl mx-2 font-['Coiny']">:</span>
            <div className="flex items-center justify-center w-16 h-12 bg-white border-4 border-gray-300 rounded-xl">
              <span className="text-[#3E8E87] text-2xl font-['jf-openhuninn-2.0']">36</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              className={`px-4 py-2 rounded-full font-semibold ${
                activeTimeSlot === "12:00"
                  ? "bg-[#3E8E87] text-white"
                  : "bg-white border-2 border-gray-300 text-gray-500"
              }`}
              onClick={() => setActiveTimeSlot("12:00")}
            >
              12:00 現正瘋搶
            </button>
            <button
              className={`px-4 py-2 rounded-full font-semibold ${
                activeTimeSlot === "08:00"
                  ? "bg-[#3E8E87] text-white"
                  : "bg-white border-2 border-gray-300 text-gray-500"
              }`}
              onClick={() => setActiveTimeSlot("08:00")}
            >
              08:00 明天開搶
            </button>
            <button
              className={`px-4 py-2 rounded-full font-semibold ${
                activeTimeSlot === "18:00"
                  ? "bg-[#3E8E87] text-white"
                  : "bg-white border-2 border-gray-300 text-gray-500"
              }`}
              onClick={() => setActiveTimeSlot("18:00")}
            >
              18:00 明天開搶
            </button>
            <button className="px-4 py-2 text-gray-900 font-semibold flex items-center">
              查看更多 <ChevronRight className="ml-1 w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Product Cards */}
        <div className="relative">
          {/* Left Arrow */}
          <button className="absolute -left-10 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-[#E8652B] rounded-full shadow-[4px_6px_0px_#74281A] flex items-center justify-center z-10">
            <ChevronLeft className="w-10 h-10 text-white" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularBooks.map((book) => (
              <div key={book.id} className="relative">
                {/* Book Image with Tag */}
                <div className="relative mb-4">
                  <div className="border-4 border-gray-300 rounded-xl overflow-hidden">
                    <Image
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      width={354}
                      height={354}
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Corner Tag */}
                  {book.isNew && (
                    <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                      <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-2 rotate-45 bg-[#3E8E87] text-white py-1 px-8 text-center">
                        <span className="text-white text-xl font-['jf-openhuninn-2.0']">NEW</span>
                      </div>
                    </div>
                  )}

                  {book.isHot && (
                    <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                      <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-2 rotate-45 bg-[#E8652B] text-white py-1 px-8 text-center">
                        <span className="text-white text-xl font-['jf-openhuninn-2.0']">HOT</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Action Buttons */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center gap-2 p-6">
                    <button className="flex-1 h-12 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[4px_6px_0px_#74281A]">
                      加入購物車
                    </button>
                    <button className="w-12 h-12 bg-white border-2 border-[#E8652B] rounded-full flex items-center justify-center shadow-[4px_6px_0px_#74281A]">
                      <Heart className="w-6 h-6 text-[#E8652B]" />
                    </button>
                  </div>
                </div>

                {/* Book Info */}
                <div className="space-y-2">
                  {/* Category and Age Range */}
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#F3FAF8] text-[#295C58]">
                      {book.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#FEF5EE] text-[#B4371A]">
                      {book.ageRange}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl text-[#2F726D] font-['jf-openhuninn-2.0']">{book.title}</h3>

                  {/* Author & Publisher */}
                  <div className="flex text-sm text-gray-700">
                    <span className="mr-2">{book.author}</span>
                    <span>{book.publisher}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-end">
                    <span className="text-xl text-[#E8652B] font-['jf-openhuninn-2.0']">${book.price}</span>
                    <span className="ml-2 text-sm text-gray-700 line-through">原價 NT${book.originalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button className="absolute -right-10 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-[#E8652B] rounded-full shadow-[4px_6px_0px_#74281A] flex items-center justify-center z-10">
            <ChevronRight className="w-10 h-10 text-white" />
          </button>
        </div>
      </div>
    </section>
  )
}
