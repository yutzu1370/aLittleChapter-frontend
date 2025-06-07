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
      console.log('開始獲取套裝推薦資料...')
      
      const bundleBooks = await getHomeBundleRecommendations()
   
      
      if (bundleBooks && Array.isArray(bundleBooks) && bundleBooks.length > 0) {
        // 從所有套裝中隨機選擇2筆
        const randomBundles = getRandomItems(bundleBooks, 2)
        console.log('選擇的隨機書籍:', randomBundles)
        setBundles(randomBundles)
      } else {
        console.error('無有效的書籍資料:', bundleBooks)
        setError("獲取套裝推薦資料失敗: 無有效資料")
      }
    } catch (err) {
      console.error("獲取套裝推薦資料時發生錯誤:", err)
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
          console.warn('後端購物車同步失敗:', backendResult.message);
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
      console.error("加入購物車失敗:", error);
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
                    <button
                      onClick={() => handleBuyNow(bundle)}
                      disabled={isAddingToCart === bundle.id}
                      className={`px-6 py-3 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[4px_6px_0px_#74281A] transition-all ${
                        isAddingToCart === bundle.id 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:bg-[#FEF5EE]'
                      }`}
                    >
                      {isAddingToCart === bundle.id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#E8652B] border-t-transparent rounded-full animate-spin" />
                          加入中...
                        </div>
                      ) : (
                        '立即購買'
                      )}
                    </button>
                    <Link
                      href={`/products/${bundle.id}`}
                      className="px-6 py-3 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[4px_6px_0px_#74281A] hover:bg-[#FEF5EE] transition-all"
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
