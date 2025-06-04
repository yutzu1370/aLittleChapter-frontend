"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getHomeBundleRecommendations, Bundle } from "@/lib/api/homebundle"

export default function RecommendedSets() {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // 動物圖片對應表
  const animalImages = [
    { image: "/images/home/sec03_Bear.png", position: "right" },
    { image: "/images/home/sec03_Rabbit.png", position: "left" },
  ]

  // 獲取套裝推薦資料
  const fetchBundles = async () => {
    try {
      setIsLoading(true)
      const response = await getHomeBundleRecommendations()
      
      if (response.status && response.data?.bundles) {
        // 從所有套裝中隨機選擇2筆
        const randomBundles = getRandomItems(response.data.bundles, 2)
        setBundles(randomBundles)
      } else {
        setError(response.message || "獲取套裝推薦資料失敗")
      }
    } catch (err) {
      setError("發生錯誤，請稍後再試")
      console.error("獲取套裝推薦資料時發生錯誤:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // 從陣列中隨機選擇指定數量的項目
  const getRandomItems = <T,>(items: T[], count: number): T[] => {
    if (!items || items.length === 0) return []
    if (items.length <= count) return [...items]
    
    const shuffled = [...items].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  useEffect(() => {
    fetchBundles()
  }, [])

  // 載入中狀態
  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <p className="text-xl text-gray-500">載入中...</p>
          </div>
        </div>
      </section>
    )
  }

  // 錯誤狀態
  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <p className="text-xl text-red-500">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center mb-16">
          <div className="w-12 h-12 mr-4 relative">
            <Image
              src="/images/icon/icon_gift.png"
              alt="Icon"
              width={48}
              height={48}
            />
          </div>
          <h2 className="text-4xl font-normal text-[#2F726D] tracking-widest]">套裝推薦</h2>
        </div>

        <div className="space-y-6">
          {bundles.map((bundle, index) => (
            <div
              key={bundle.id}
              className="bg-white rounded-[48px] border-[6px] border-[#F8D0B0] p-3 relative mb-6"
            >
              <div className={`flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                {/* Book Image */}
                <div className="w-[600px] h-[400px] relative flex-shrink-0 rounded-[48px]">
                  <Image
                    src={bundle.imageUrl || "/placeholder.svg"}
                    alt={bundle.title}
                    fill
                    className="object-contain p-6 rounded-[48px]"
                  />
                </div>

                {/* Text Content */}
                <div className="w-[606px] flex flex-col justify-center px-12">
                  <h3 className="text-3xl text-[#2F726D] mb-4">{bundle.title}</h3>
                  <div 
                    className="text-xl text-gray-900 mb-6 font-noto-sans-tc text-justify"
                    dangerouslySetInnerHTML={{ __html: bundle.introductionHtml }}
                  />
                  <div className="flex space-x-3">
                    <Link
                      href={`/products/${bundle.id}`}
                      className="px-6 py-3 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[4px_6px_0px_#74281A]"
                    >
                      立即購買
                    </Link>
                    <Link
                      href={`/products/${bundle.id}`}
                      className="px-6 py-3 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[4px_6px_0px_#74281A]"
                    >
                      了解更多
                    </Link>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              {/* Animal Character */}
              <div
                className={`absolute w-[200px] h-[200px] ${
                  animalImages[index % animalImages.length].position === "right"
                    ? "right-[-100px] bottom-[-20px]"
                    : "left-[-100px] bottom-[-20px]"
                }`}
              >
                <Image
                  src={animalImages[index % animalImages.length].image || "/placeholder.svg"}
                  alt="Character"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Decorative Ribbon */}
              <div
                className={`absolute w-[240px] h-[240px] ${
                  index % 2 === 0 ? "left-[0px] top-[0px]" : "right-[0px] top-[0px]"
                }`}
              >
                <Image
                  src={index % 2 === 0 ? "/images/left_top_ribbon.png" : "/images/right_top_rabbit.png"}
                  alt="Decorative ribbon"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
