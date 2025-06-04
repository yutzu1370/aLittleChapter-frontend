"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getHomeLatestProducts, Book } from "@/lib/api/homeNew"
// Swiper 相關導入
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import { Pagination, Navigation, Autoplay } from "swiper/modules"
// Swiper 樣式
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

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

// 將 API 書籍資料轉換為前端需要的格式
const mapApiBookToFeaturedBook = (book: Book): FeaturedBookItem => {
  console.log('處理書籍:', book); // 調試輸出
  
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    publisher: book.publisher,
    ageRange: book.ageRangeName,
    description: book.introductionHtml || "此書的詳細描述將在書籍詳情頁面顯示。",
    image: book.imageUrl || "/images/book_05.png", // 使用預設圖片作為備用
    tags: [
      { 
        label: book.categoryName, 
        color: "text-[#295C58]", 
        bg: "bg-[#F3FAF8]" 
      },
      { 
        label: book.ageRangeName, 
        color: "text-[#B4371A]", 
        bg: "bg-[#FEF5EE]" 
      },
    ],
  }
}

// 靜態資料作為備用
const staticBooks: FeaturedBookItem[] = [
  {
    id: 401,
    title: "音樂森林的秘密",
    author: "林依琴",
    publisher: "藝術之聲出版",
    ageRange: "3-5歲",
    description: "一位熱愛音樂的女孩進入神秘森林，發現這裡住著來自世界各地的音樂家，他們用不同樂器交流，最後攜手創造最美的樂章。",
    image: "/images/book_05.png",
    tags: [
      { label: "音樂賞析", color: "text-[#295C58]", bg: "bg-[#F3FAF8]" },
      { label: "3-5歲", color: "text-[#B4371A]", bg: "bg-[#FEF5EE]" },
    ],
  },
  {
    id: 402,
    title: "星星掉下來了",
    author: "王小明",
    publisher: "童話王國",
    ageRange: "0-2歲",
    description: "這是一個關於小熊幫助落下的星星回家的溫馨故事，適合睡前閱讀給小寶寶聽。",
    image: "/images/book_05.png",
    tags: [
      { label: "睡前故事", color: "text-[#295C58]", bg: "bg-[#F3FAF8]" },
      { label: "0-2歲", color: "text-[#B4371A]", bg: "bg-[#FEF5EE]" },
    ],
  }
];

export default function NewArrivals() {
  const [books, setBooks] = useState<FeaturedBookItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sectionTitle, setSectionTitle] = useState("本月亮點新書")
  const [error, setError] = useState<string | null>(null)
  const swiperRef = useRef<SwiperType | null>(null)

  // 從 API 獲取資料
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log('開始獲取數據...')
        
        const response = await getHomeLatestProducts()
        console.log('API 回應結果:', response)
        
        if (response.status && response.data && response.data.books && response.data.books.length > 0) {
          console.log('獲取到書籍數據:', response.data.books.length, '筆')
          // 將 API 書籍資料轉換為前端需要的格式
          try {
            const apiBooks = response.data.books.map(mapApiBookToFeaturedBook)
            console.log('轉換後的書籍數據:', apiBooks.length, '筆')
            
            setBooks(apiBooks)
            setSectionTitle(response.data.title || "本月亮點新書")
          } catch (mapError) {
            console.error('數據轉換錯誤:', mapError)
            setError('數據格式異常')
            // 使用靜態資料作為備用
            setBooks(staticBooks)
          }
        } else {
          console.warn('API 回應無有效數據或數據為空')
          if (!response.status) {
            setError(response.message || '獲取資料失敗')
          } else {
            setError('無可用的書籍資料')
          }
          // 使用靜態資料作為備用
          setBooks(staticBooks)
        }
      } catch (error) {
        console.error("獲取最新書籍資料失敗:", error)
        setError('連接伺服器失敗')
        // 使用靜態資料作為備用
        setBooks(staticBooks)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // 加載中顯示
  if (isLoading) {
    return (
      <section className="bg-[#F3FAF8] px-2 md:px-8 py-8 md:py-12 flex flex-col items-center gap-10 md:gap-14 relative overflow-hidden min-h-[540px]">
        <div className="flex items-center gap-4 mb-2 md:mb-4">
          <Image
            src="/images/icon/icon_book.png"
            alt="Icon"
            width={48}
            height={48}
            className="w-10 h-10 md:w-12 md:h-12"
          />
          <h2 className="font-[jf-openhuninn-2.0] text-[2.25rem] md:text-[2.5rem] text-[#2F726D] tracking-[0.05em] leading-tight">
            載入中...
          </h2>
        </div>
      </section>
    )
  }

  // 無資料或錯誤時顯示
  if (books.length === 0) {
    return (
      <section className="bg-[#F3FAF8] px-2 md:px-8 py-8 md:py-12 flex flex-col items-center gap-10 md:gap-14 relative overflow-hidden min-h-[540px] rounded-[64px]">
        <div className="flex items-center gap-4 mb-2 md:mb-4">
          <Image
            src="/images/icon/icon_book.png"
            alt="Icon"
            width={48}
            height={48}
            className="w-10 h-10 md:w-12 md:h-12"
          />
          <h2 className="font-[jf-openhuninn-2.0] text-[2.25rem] md:text-[2.5rem] text-[#2F726D] tracking-[0.05em] leading-tight">
            {error || "暫無新書資料"}
          </h2>
        </div>
      </section>
    )
  }

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <section className="bg-[#F3FAF8] px-2 md:px-8 py-8 md:py-12 flex flex-col items-center gap-10 md:gap-14 relative overflow-hidden rounded-[64px]">
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
          {sectionTitle}
        </h2>
      </div>

      {/* Swiper 輪播區 */}
      <div className="relative w-full max-w-[1100px]">
        {/* 左箭頭 */}
        <button
          onClick={handlePrev}
          aria-label="上一筆"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-[#E8652B] rounded-full shadow-[4px_6px_0px_#74281A] w-12 h-12 md:w-16 md:h-16 flex items-center justify-center hover:bg-[#FEF5EE] transition cursor-pointer"
        >
          <ChevronLeft className="w-7 h-7 text-[#E8652B]" />
        </button>

        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
            bulletClass: "custom-bullet",
            bulletActiveClass: "custom-bullet-active",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="min-h-[420px] md:min-h-[540px]"
        >
          {books.map((book, index) => (
            <SwiperSlide key={book.id}>
              {/* 書本內容卡片 */}
              <div className="flex flex-col md:flex-row flex-1 bg-[url('/images/open_book.png')] bg-cover bg-center min-h-[360px] md:min-h-[550px]">
                {/* 書本圖片 */}
                <div className="flex items-center justify-center basis-[50%] min-w-[220px] p-6 mb-6 md:p-10 translate-x-2 md:translate-x-4">
                  <div className="relative w-48 h-48 md:w-96 md:h-96">
                    <Image
                      src={book.image}
                      alt={book.title}
                      fill
                      className="object-cover rounded-2xl"
                      sizes="(max-width: 768px) 192px, 288px"
                      priority={index === 0}
                    />
                  </div>
                </div>
                {/* 右側內容 */}
                <div className="flex flex-col justify-center basis-[50%] gap-4 md:gap-2 px-4 md:pl-12 pr-24 py-6 md:py-12">
                  <h3 className="font-[jf-openhuninn-2.0] text-[1.5rem] md:text-[2.25rem] text-[#2F726D] leading-tight mb-1 md:mb-2 ">
                    {book.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-sm md:text-base text-[#4F4F4F] mb-1 ml-1 ">
                    <span>{book.author}</span>
                    <span className="hidden md:inline">|</span>
                    <span>{book.publisher}</span>
                  </div>
                  <div className="flex gap-2">
                    {book.tags.map((tag, i) => (
                      <span
                        key={tag.label + i}
                        className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${tag.bg} ${tag.color}`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  {book.description.includes('<') ? (
                    <div 
                      className="text-base md:text-lg h-[120px] text-[#121212] mb-2 md:mb-4 leading-relaxed overflow-y-auto font-noto-sans-tc"
                      dangerouslySetInnerHTML={{ __html: book.description }}
                    />
                  ) : (
                    <p className="text-base md:text-lg h-[120px] text-[#121212] mb-2 md:mb-4 leading-relaxed overflow-y-auto font-noto-sans-tc">
                      {book.description}
                    </p>
                  )}
                  <div className="flex gap-3 md:gap-4 mt-2">
                    <Link
                      href={`/products/${book.id}`}
                      className="bg-white border-2 border-[#E8652B] text-[#E8652B] font-semibold rounded-full px-5 py-2 md:px-6 md:py-3 shadow-[4px_6px_0px_#74281A] hover:bg-[#FEF5EE] transition text-sm md:text-base"
                    >
                      立即購買
                    </Link>
                    <Link
                      href={`/products/${book.id}`}
                      className="bg-white border-2 border-[#E8652B] text-[#E8652B] font-semibold rounded-full px-5 py-2 md:px-6 md:py-3 shadow-[4px_6px_0px_#74281A] hover:bg-[#FEF5EE] transition text-sm md:text-base"
                    >
                      了解更多
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 右箭頭 */}
        <button
          onClick={handleNext}
          aria-label="下一筆"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border-2 border-[#E8652B] rounded-full shadow-[4px_6px_0px_#74281A] w-12 h-12 md:w-16 md:h-16 flex items-center justify-center hover:bg-[#FEF5EE] transition cursor-pointer"
        >
          <ChevronRight className="w-7 h-7 text-[#E8652B]" />
        </button>

        {/* 右下角插圖（小老鼠） */}
        <Image
          src="/images/animals/animals_mouse_home.png"
          alt="小老鼠"
          width={160}
          height={160}
          className="hidden md:block absolute right-8 bottom-4 w-32 md:w-40 pointer-events-none select-none z-10"
        />

        {/* 指示點容器，使用簡單的類名 */}
        <div className="custom-pagination flex justify-center items-center gap-3 mt-6"></div>
      </div>

      {/* 自定義 Swiper 分頁器樣式 */}
      <style jsx global>{`
        .custom-bullet {
          width: 1rem;
          height: 1rem;
          border-radius: 9999px;
          display: inline-block;
          margin: 0 0.375rem;
          background-color: #D1D1D1;
          opacity: 0.8;
          transition: all 0.2s;
          cursor: pointer;
        }
        
        .custom-bullet-active {
          background-color: #2F726DA3;
          transform: scale(1.25);
        }
      `}</style>
    </section>
  )
}
