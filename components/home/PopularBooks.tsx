"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { motion } from "framer-motion"

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
}

// 定義時段數據類型
type TimeSlotData = {
  [key: string]: {
    books: Book[]
    label: string
  }
}

export default function PopularBooks() {
  const popularBooks: Book[] = [
    {
      id: 1,
      title: "料理小天才",
      author: "劉巧兒",
      publisher: "美味出版社",
      price: 199,
      originalPrice: 300,
      image: "/images/home/book_01.png",
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
      image: "/images/home/book_02.png",
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
      image: "/images/home/book_03.png",
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
      image: "/images/home/book_04.png",
      category: "兒童文學",
      ageRange: "6-10歲",
      tags: [
        { text: "精選", type: "primary" },
        { text: "新書", type: "accent" },
      ],
    },
    {
      id: 5,
      title: "小魔法師的冒險",
      author: "王小明",
      publisher: "奇幻出版社",
      price: 280,
      originalPrice: 320,
      image: "/images/home/book_01.png",
      category: "奇幻冒險",
      ageRange: "8-12歲",
      tags: [
        { text: "精選", type: "primary" },
        { text: "熱銷", type: "accent" },
      ],
      isNew: true,
    },
    {
      id: 6,
      title: "動物王國歷險記",
      author: "林美麗",
      publisher: "自然出版社",
      price: 320,
      originalPrice: 380,
      image: "/images/home/book_02.png",
      category: "自然科學",
      ageRange: "6-9歲",
      tags: [
        { text: "精選", type: "primary" },
        { text: "熱銷", type: "accent" },
      ],
    },
    {
      id: 7,
      title: "數學奇遇記",
      author: "張教授",
      publisher: "智慧出版社",
      price: 299,
      originalPrice: 350,
      image: "/images/home/book_03.png",
      category: "益智學習",
      ageRange: "7-10歲",
      tags: [
        { text: "精選", type: "primary" },
        { text: "熱銷", type: "accent" },
      ],
      isHot: true,
    },
    {
      id: 8,
      title: "小小藝術家",
      author: "蘇畫家",
      publisher: "彩色出版社",
      price: 280,
      originalPrice: 340,
      image: "/images/home/book_04.png",
      category: "藝術創作",
      ageRange: "5-8歲",
      tags: [
        { text: "精選", type: "primary" },
        { text: "新書", type: "accent" },
      ],
    },
    {
      id: 9,
      title: "恐龍大冒險",
      author: "吳恐龍",
      publisher: "遠古出版社",
      price: 399,
      originalPrice: 450,
      image: "/images/home/book_01.png",
      category: "自然科學",
      ageRange: "6-12歲",
      tags: [
        { text: "精選", type: "primary" },
        { text: "熱銷", type: "accent" },
      ],
      isNew: true,
    },
    {
      id: 10,
      title: "海底世界探索",
      author: "林海洋",
      publisher: "藍色出版社",
      price: 320,
      originalPrice: 380,
      image: "/images/home/book_02.png",
      category: "自然科學",
      ageRange: "7-12歲",
      tags: [
        { text: "精選", type: "primary" },
        { text: "新書", type: "accent" },
      ],
    },
    {
      id: 11,
      title: "詩詞小達人",
      author: "李詩人",
      publisher: "文學出版社",
      price: 260,
      originalPrice: 320,
      image: "/images/home/book_03.png",
      category: "語文學習",
      ageRange: "8-12歲",
      tags: [
        { text: "精選", type: "primary" },
        { text: "熱銷", type: "accent" },
      ],
      isHot: true,
    },
    {
      id: 12,
      title: "機器人大作戰",
      author: "趙科技",
      publisher: "科技出版社",
      price: 420,
      originalPrice: 480,
      image: "/images/home/book_04.png",
      category: "科學啟蒙",
      ageRange: "9-14歲",
      tags: [
        { text: "精選", type: "primary" },
        { text: "新書", type: "accent" },
      ],
    },
  ]

  // 正確定義類型
  const timeSlotData: TimeSlotData = {
    "12:00": {
      books: popularBooks.slice(0, 4),
      label: "現正瘋搶",
    },
    "08:00": {
      books: popularBooks.slice(4, 8),
      label: "明天開搶",
    },
    "18:00": {
      books: popularBooks.slice(8, 12),
      label: "明天開搶",
    },
  }

  // 簡化狀態管理
  const [activeTimeSlot, setActiveTimeSlot] = useState("12:00")
  const [favorites, setFavorites] = useState<number[]>([])
  const [hours, setHours] = useState(1)
  const [minutes, setMinutes] = useState(59)
  const [seconds, setSeconds] = useState(36)

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

  // 收藏功能
  const toggleFavorite = (bookId: number) => {
    if (favorites.includes(bookId)) {
      setFavorites(favorites.filter((id) => id !== bookId))
    } else {
      setFavorites([...favorites, bookId])
    }
  }

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
              className="animate-pulse"
            />
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-normal text-[#2F726D] tracking-widest font-['jf-openhuninn-2.0']"
          >
            限時搶購
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

          {/* Filters */}
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

        {/* Book Display */}
        <div className="relative">
          {/* Left Arrow */}
          <motion.button 
            className="absolute -left-10 top-1/4 transform -translate-y-1/2 w-20 h-20 bg-[#E8652B] rounded-full shadow-[4px_6px_0px_#74281A] flex items-center justify-center z-10 origin-center"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // 切換到上一個時段
              const times = Object.keys(timeSlotData);
              const currentIndex = times.indexOf(activeTimeSlot);
              const prevIndex = (currentIndex - 1 + times.length) % times.length;
              setActiveTimeSlot(times[prevIndex]);
            }}
            aria-label="上一頁"
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ChevronLeft className="w-10 h-10 text-white" />
          </motion.button>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeSlotData[activeTimeSlot].books.map((book) => (
              <motion.div 
                key={book.id} 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                {/* Book Image with Tag */}
                <div className="relative mb-4">
                  <motion.div 
                    className="border-4 border-gray-300 rounded-xl overflow-hidden"
                    whileHover={{ 
                      borderColor: "#E8652B",
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Image
                      src={book.image || "/placeholder.svg"}
                      alt={book.title}
                      width={354}
                      height={354}
                      className="w-full h-auto transition-transform duration-500 hover:scale-105"
                    />
                  </motion.div>

                  {/* Corner Tag */}
                  {book.isNew && (
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

                  {book.isHot && (
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
                    className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center gap-2 p-6"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.05, backgroundColor: "#E8652B", color: "white" }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 h-12 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[4px_6px_0px_#74281A] transition-colors duration-100"
                      onClick={() => {
                        alert(`已將《${book.title}》加入購物車！`)
                      }}
                    >
                      加入購物車
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 bg-white border-2 ${
                        favorites.includes(book.id) 
                          ? "border-[#E8652B] bg-[#FEF5EE]" 
                          : "border-[#E8652B]"
                      } rounded-full flex items-center justify-center shadow-[4px_6px_0px_#74281A]`}
                      onClick={() => toggleFavorite(book.id)}
                      aria-label={favorites.includes(book.id) ? "從收藏移除" : "加入收藏"}
                    >
                      <Heart 
                        className={`w-6 h-6 ${
                          favorites.includes(book.id) 
                            ? "text-[#E8652B] fill-[#E8652B]" 
                            : "text-[#E8652B]"
                        }`} 
                      />
                    </motion.button>
                  </div>
                </div>

                {/* Book Info */}
                <motion.div 
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
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
                  <h3 className="text-xl text-[#2F726D] font-['jf-openhuninn-2.0'] hover:text-[#E8652B] transition-colors duration-300 cursor-pointer">
                    {book.title}
                  </h3>

                  {/* Author & Publisher */}
                  <div className="flex text-sm text-gray-700">
                    <span className="mr-2">{book.author}</span>
                    <span>{book.publisher}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-end">
                    <motion.span 
                      className="text-xl text-[#E8652B] font-['jf-openhuninn-2.0']"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      ${book.price}
                    </motion.span>
                    <span className="ml-2 text-sm text-gray-700 line-through">原價 NT${book.originalPrice}</span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Right Arrow */}
          <motion.button 
            className="absolute -right-10 top-1/4 transform -translate-y-1/2 w-20 h-20 bg-[#E8652B] rounded-full shadow-[4px_6px_0px_#74281A] flex items-center justify-center z-10 origin-center"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // 切換到下一個時段
              const times = Object.keys(timeSlotData);
              const currentIndex = times.indexOf(activeTimeSlot);
              const nextIndex = (currentIndex + 1) % times.length;
              setActiveTimeSlot(times[nextIndex]);
            }}
            aria-label="下一頁"
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ChevronRight className="w-10 h-10 text-white" />
          </motion.button>

          {/* Time Slot Indicators */}
          <div className="flex justify-center mt-8 gap-3">
            {Object.keys(timeSlotData).map((time) => (
              <motion.button
                key={time}
                className={`w-4 h-4 rounded-full ${
                  activeTimeSlot === time 
                    ? "bg-[#E8652B]" 
                    : "bg-gray-300 hover:bg-gray-400"
                } transition-colors duration-300`}
                onClick={() => setActiveTimeSlot(time)}
                aria-label={`切換至 ${time} 時段`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  scale: activeTimeSlot === time ? 1.1 : 1
                }}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
      
    </section>
  )
}
