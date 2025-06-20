"use client"

import { useState, useEffect } from "react"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { getWishlistApi, removeFromWishlistApi, WishlistItem } from "@/lib/api/wishlist"
import { useAuthStore } from "@/lib/store/useAuthStore"
import { useFavoritesStore } from "@/lib/store/useFavoritesStore"
import { useCartStore } from "@/lib/store/useCartStore"
import { addItemToBackendApi } from "@/lib/api/cart"
import { useDebounce } from "@/hooks/use-debounce"

export default function FavoritesClient() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set())

  const { isAuthenticated } = useAuthStore()
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const { addItem } = useCartStore()

  // 獲取收藏清單
  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await getWishlistApi()
      
      if (response.status && response.data) {
        setWishlistItems(response.data)
      } else {
        throw new Error(response.message || '收藏清單資料格式錯誤')
      }
    } catch (error) {
      setError('無法載入收藏清單')
      toast.error('獲取收藏清單失敗', {
        description: error instanceof Error ? error.message : '請稍後再試'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [isAuthenticated])

  // 移除收藏的原始處理函數
  const handleRemoveFromWishlistOriginal = async (productId: number) => {
    if (!isAuthenticated) {
      toast.info("請先登入", {
        description: "登入後才能使用收藏功能",
        duration: 3000,
      })
      return
    }

    const item = wishlistItems.find(item => item.productId === productId)
    const newRemoving = new Set(removingItems)
    newRemoving.add(productId)
    setRemovingItems(newRemoving)
    
    try {
      const response = await removeFromWishlistApi(productId)
      if (response.status) {
        // 從本地狀態移除
        setWishlistItems(prev => prev.filter(item => item.productId !== productId))
        // 更新全域收藏狀態
        toggleFavorite(productId)
        // 觸發收藏變更事件
        window.dispatchEvent(new CustomEvent('wishlistChanged'))
        toast.success(`《${item?.title}》已從收藏移除`, {
          position: "top-center",
          duration: 2000,
        })
      } else {
        toast.error("移除收藏失敗", {
          description: response.message || "請稍後再試",
          duration: 3000,
        })
      }
    } catch (error) {
      toast.error("移除收藏失敗", {
        description: "請稍後再試",
        duration: 3000,
      })
    } finally {
      newRemoving.delete(productId)
      setRemovingItems(newRemoving)
    }
  }

  // 加入購物車的原始處理函數
  const handleAddToCartOriginal = async (item: WishlistItem) => {
    try {
      // 將 WishlistItem 轉換為購物車商品格式
      const productForCart = {
        id: item.productId.toString(),
        name: item.title,
        description: '',
        price: item.discountPrice || item.price,
        originalPrice: item.price,
        image: item.coverImage,
        stockQuantity: item.stockQuantity,
        authorName: '',
        publisherName: '',
      }
      
      // 加入到本地購物車
      addItem(productForCart, 1)
      
      // 如果使用者已登入，同時加入到後端購物車
      if (isAuthenticated) {
        const cartItem = {
          productId: item.productId,
          quantity: 1
        }
        
        const backendResult = await addItemToBackendApi(cartItem)
        
        if (!backendResult.status) {
          // 後端購物車同步失敗，但不影響主流程
        }
      }
      
      toast.success(`已將《${item.title}》加入購物車！`, {
        position: "top-center",
        duration: 2000,
      })
    } catch (error) {
      toast.error("加入購物車失敗", {
        description: "請稍後再試",
        duration: 3000,
      })
    }
  }

  // 使用 debounce 包裝的處理函數
  const handleRemoveFromWishlist = useDebounce(handleRemoveFromWishlistOriginal, 500)
  const handleAddToCart = useDebounce(handleAddToCartOriginal, 500)

  // 未登入狀態
  if (!isAuthenticated) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
          <div className="mb-6 bg-[#FEF5EE] p-4 rounded-full">
            <Heart className="h-12 w-12 text-[#F8D0B0]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 font-noto-sans-tc">我的收藏</h2>
          <p className="text-gray-600 max-w-md font-noto-sans-tc text-sm sm:text-base">
            請先登入以查看您的收藏清單
          </p>
          <Link href="/auth/login">
            <Button className="mt-4 bg-[#E8652B] hover:bg-[#D55A24] text-white font-noto-sans-tc">
              立即登入
            </Button>
          </Link>
        </div>
      </section>
    )
  }

  // 載入中狀態
  if (loading) {
    return (
      <section className="space-y-6 min-h-[600px]">
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#3E8E87] mb-4"></div>
          <p className="text-gray-600 font-noto-sans-tc">載入收藏清單中...</p>
        </div>
      </section>
    )
  }

  // 錯誤狀態
  if (error) {
    return (
      <section className="space-y-6 min-h-[600px]">
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
          <div className="mb-6 bg-red-50 p-4 rounded-full">
            <Heart className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 font-noto-sans-tc">載入失敗</h2>
          <p className="text-gray-600 max-w-md mb-4 font-noto-sans-tc text-sm sm:text-base">{error}</p>
          <Button 
            onClick={fetchWishlist}
            className="bg-[#E8652B] hover:bg-[#D55A24] text-white font-noto-sans-tc"
          >
            重新載入
          </Button>
        </div>
      </section>
    )
  }

  // 空收藏清單
  if (wishlistItems.length === 0) {
    return (
      <section className="space-y-6 min-h-[600px]">
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
          <div className="mb-6 bg-[#FEF5EE] p-4 rounded-full">
            <Heart className="h-12 w-12 text-orange-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 font-noto-sans-tc">我的收藏</h2>
          <p className="text-gray-600 max-w-md mb-4 font-noto-sans-tc text-sm sm:text-base">
            目前尚未收藏任何書籍
          </p>
          <Link href="/products">
            <Button className="bg-[#E8652B] hover:bg-[#D55A24] text-white font-noto-sans-tc">
              開始探索書籍
            </Button>
          </Link>
        </div>
      </section>
    )
  }

  // 收藏清單內容
  return (
    <section className="space-y-6 font-noto-sans-tc min-h-[600px]">
      {/* 標題 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Heart className="h-5 w-5 text-[#E8652B]" />
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">我的收藏</h1>
        </div>
        <div className="text-sm text-gray-600">
          共 {wishlistItems.length} 項商品
        </div>
      </div>

      {/* 收藏商品網格 */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 grid-rows-auto">
        {wishlistItems.map((item, index) => (
          <motion.div
            key={`wishlist-${item.productId}-${index}`}
            className="relative group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.3) }}
            whileHover={{ y: -5 }}
          >
            {/* 商品圖片 */}
            <div className="relative overflow-hidden">
              <Link href={`/products/${item.productId}`}>
                <div className="p-2 sm:p-3 lg:p-4">
                  <Image
                    src={item.coverImage || "/placeholder.svg"}
                    alt={item.title}
                    width={354}
                    height={354}
                    className="w-full h-auto transition-all duration-500 rounded-lg"
                  />
                </div>
              </Link>
              
              {/* 移除收藏按鈕 */}
              <motion.button
                className="absolute top-1 right-1 sm:top-2 sm:right-2 lg:top-3 lg:right-3 w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleRemoveFromWishlist(item.productId)}
                disabled={removingItems.has(item.productId)}
                aria-label="從收藏移除"
              >
                {removingItems.has(item.productId) ? (
                  <div className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-red-500" />
                )}
              </motion.button>
            </div>

            {/* 商品資訊 */}
            <div className="p-2 sm:p-3 lg:p-4 space-y-1 sm:space-y-2">
              {/* 商品標題 */}
              <Link href={`/products/${item.productId}`}>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 hover:text-[#E8652B] transition-colors duration-300 line-clamp-2 cursor-pointer leading-tight">
                  {item.title}
                </h3>
              </Link>

              {/* 價格 */}
              <div className="flex items-end gap-1 sm:gap-2">
                <span className="text-base sm:text-lg lg:text-xl font-bold text-[#E8652B]">
                  NT${item.discountPrice || item.price}
                </span>
                {item.discountPrice && (
                  <span className="text-xs sm:text-sm text-gray-500 line-through">
                    NT${item.price}
                  </span>
                )}
              </div>

              {/* 庫存狀態 */}
              <div className="text-xs sm:text-sm text-gray-600">
                {item.stockQuantity > 0 ? (
                  <span className="text-green-600">庫存 {item.stockQuantity} 本</span>
                ) : (
                  <span className="text-red-500">暫時缺貨</span>
                )}
              </div>

              {/* 操作按鈕 */}
              <div className="flex gap-1 sm:gap-2 pt-1 sm:pt-2">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#E8652B", color: "white" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 h-8 sm:h-10 lg:h-12 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[1px_2px_0px_#74281A] sm:shadow-[2px_4px_0px_#74281A] lg:shadow-[4px_6px_0px_#74281A] transition-colors duration-100 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-500 disabled:shadow-none flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base"
                  onClick={() => handleAddToCart(item)}
                  disabled={item.stockQuantity === 0}
                >
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{item.stockQuantity > 0 ? "加入購物車" : "暫時缺貨"}</span>
                  <span className="sm:hidden">{item.stockQuantity > 0 ? "加入" : "缺貨"}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
