"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { getHomeBundleRecommendations } from "@/lib/api/homebundle"
import { Book } from "@/lib/types/book"
import { useAuthStore } from "@/lib/store/useAuthStore"
import { useCartStore } from "@/lib/store/useCartStore"
import { addItemToBackendApi } from "@/lib/api/cart"

export default function RecommendedSets() {
  const [bundles, setBundles] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null)
  
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { addItem } = useCartStore()

  // 動物圖片對應表
  const animalImages = [
    { image: "/images/home/sec03_Bear.png", position: "right" },
    { image: "/images/home/sec03_Rabbit.png", position: "left" },
  ]

  // 獲取套裝推薦資料
  const fetchBundles = async () => {
    try {
      setIsLoading(true)
      
      const bundleBooks = await getHomeBundleRecommendations()
   
      
      if (bundleBooks && Array.isArray(bundleBooks) && bundleBooks.length > 0) {
        // 從所有套裝中隨機選擇2筆
        const randomBundles = getRandomItems(bundleBooks, 2)
        setBundles(randomBundles)
      } else {
        setError("獲取套裝推薦資料失敗: 無有效資料")
      }
    } catch (err) {
      setError("發生錯誤，請稍後再試")
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

  // 檢查陣列是否符合 Book 類型
  const isBookArray = (arr: any[]): arr is Book[] => {
    return arr.every(item => 
      typeof item === 'object' && 
      item !== null &&
      'id' in item && 
      'title' in item && 
      'imageUrl' in item
    );
  }

  // 處理立即購買
  const handleBuyNow = async (bundle: Book) => {
    setIsAddingToCart(bundle.id)
    
    try {
      // 將 Book 類型轉換為 Product 類型以符合 addItem 的要求
      const productForCart = {
        id: bundle.id.toString(),
        name: bundle.title,
        description: bundle.introductionHtml || '',
        price: bundle.discountPrice || bundle.price,
        originalPrice: bundle.price,
        image: bundle.imageUrl || '',
        stockQuantity: bundle.stockQuantity, // 使用 API 回應的庫存數量
        authorName: bundle.author,
        publisherName: bundle.publisher,
      };
      
      // 加入到本地購物車（localStorage）
      addItem(productForCart, 1);
      
      // 如果使用者已登入，同時加入到後端購物車
      if (isAuthenticated) {
        const cartItem = {
          productId: bundle.id,
          quantity: 1
        };
        
        const backendResult = await addItemToBackendApi(cartItem);
        
        if (!backendResult.status) {
          // 即使後端失敗，本地購物車已經成功，所以仍然顯示成功訊息
          // 但可以在控制台記錄警告
        }
      }
      
      toast.success(`已將《${bundle.title}》加入購物車！`, {
        duration: 2000,
      });
      
      // 跳轉到購物車頁面
      router.push('/cart');
      
    } catch (error) {
      toast.error("加入購物車失敗", {
        description: "請稍後再試",
        duration: 3000,
      });
    } finally {
      setIsAddingToCart(null);
    }
  };

  useEffect(() => {
    fetchBundles()
  }, [])

  // 載入中狀態
  if (isLoading) {
    return (
      <section className="py-12 sm:py-14 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <p className="text-lg sm:text-xl text-gray-500">載入中...</p>
          </div>
        </div>
      </section>
    )
  }

  // 錯誤狀態
  if (error) {
    return (
      <section className="py-12 sm:py-14 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <p className="text-lg sm:text-xl text-red-500">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 sm:py-14 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-16 sm:px-12 lg:px-16">
        <div className="flex justify-center items-center mb-12 sm:mb-14 lg:mb-16">
          <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 mr-3 sm:mr-4 relative">
            <Image
              src="/images/icon/icon_gift.png"
              alt="Icon"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#2F726D] tracking-widest">套裝推薦</h2>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {bundles.map((bundle, index) => (
            <div
              key={bundle.id}
              className="bg-white rounded-[24px] sm:rounded-[36px] lg:rounded-[48px] border-3 sm:border-4 lg:border-[6px] border-[#F8D0B0] p-2 sm:p-3 relative mb-4 sm:mb-6"
            >
              {/* 手機版改為垂直布局 */}
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-0">
                {/* Book Image - 手機版置頂 */}
                <div className="w-full lg:w-[600px] h-[250px] sm:h-[300px] lg:h-[400px] relative flex-shrink-0 rounded-[20px] sm:rounded-[32px] lg:rounded-[48px] order-1">
                  <Image
                    src={bundle.imageUrl || "/placeholder.svg"}
                    alt={bundle.title}
                    fill
                    className="object-contain p-3 sm:p-4 lg:p-6 rounded-[20px] sm:rounded-[32px] lg:rounded-[48px]"
                  />
                </div>

                {/* Text Content - 手機版置底 */}
                <div className="w-full lg:w-[606px] flex flex-col justify-center px-4 sm:px-8 lg:px-12 order-2">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl text-[#2F726D] mb-3 sm:mb-4 text-center lg:text-left">{bundle.title}</h3>
                  <div 
                    className="text-sm sm:text-lg lg:text-xl text-gray-900 mb-4 sm:mb-5 lg:mb-6 font-noto-sans-tc text-center lg:text-justify leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: bundle.introductionHtml }}
                  />
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start">
                    <button
                      onClick={() => handleBuyNow(bundle)}
                      disabled={isAddingToCart === bundle.id}
                      className={`px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[3px_4px_0px_#74281A] sm:shadow-[4px_6px_0px_#74281A] transition-all text-sm sm:text-base ${
                        isAddingToCart === bundle.id 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-[#FEF5EE]'
                      }`}
                    >
                      {isAddingToCart === bundle.id ? (
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-[#E8652B] border-t-transparent rounded-full animate-spin" />
                          加入中...
                        </div>
                      ) : (
                        '立即購買'
                      )}
                    </button>
                    <Link
                      href={`/products/${bundle.id}`}
                      className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[3px_4px_0px_#74281A] sm:shadow-[4px_6px_0px_#74281A] hover:bg-[#FEF5EE] transition-all text-sm sm:text-base text-center"
                    >
                      了解更多
                    </Link>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              {/* Animal Character - 隱藏在小螢幕 */}
              <div
                className={`hidden lg:block absolute w-[160px] h-[160px] lg:w-[200px] lg:h-[200px] ${
                  animalImages[index % animalImages.length].position === "right"
                    ? "right-[-80px] lg:right-[-100px] bottom-[-20px]"
                    : "left-[-80px] lg:left-[-100px] bottom-[-20px]"
                }`}
              >
                <Image
                  src={animalImages[index % animalImages.length].image || "/placeholder.svg"}
                  alt="Character"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Decorative Ribbon - 隱藏在小螢幕 */}
              <div
                className={`hidden lg:block absolute w-[200px] h-[200px] lg:w-[240px] lg:h-[240px] ${
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
