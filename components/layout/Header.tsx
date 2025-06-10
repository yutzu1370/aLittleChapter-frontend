"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart, Heart, Bell } from "lucide-react"
import { AuthModal } from "@/components/auth/AuthModal"
import { useAuthStore } from "@/lib/store/useAuthStore"
import { useCartStore } from "@/lib/store/useCartStore"
import { useFavoritesStore } from "@/lib/store/useFavoritesStore"
import { getWishlistApi } from "@/lib/api/wishlist"
import { getNotificationsApi } from "@/lib/api/notifications"

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [showProductsDropdown, setShowProductsDropdown] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0) // 新增：從API獲取的收藏數量
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0) // 新增：從API獲取的未讀通知數量
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, user } = useAuthStore()
  const { items } = useCartStore()
  const { getFavoriteCount } = useFavoritesStore()
  
  // 確保客戶端 hydration 完成
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // 載入收藏數量的函數
  const fetchWishlistCount = async () => {
    if (isAuthenticated && isHydrated) {
      try {
        console.log('🚀 [Header] 開始載入收藏數量')
        const result = await getWishlistApi()
        
        console.log('📦 [Header] 收藏清單 API 回應:', result)
        
        if (result.status && result.data) {
          const count = result.data.length
          setWishlistCount(count)
          console.log('✅ [Header] 成功載入收藏數量:', count)
        } else {
          console.log('❌ [Header] 載入收藏數量失敗:', result.message)
          setWishlistCount(0)
        }
      } catch (error) {
        console.error('💥 [Header] 載入收藏數量錯誤:', error)
        setWishlistCount(0)
      }
    } else {
      // 未登入時重置收藏數量
      setWishlistCount(0)
    }
  }

  // 載入未讀通知數量的函數
  const fetchUnreadNotificationCount = async () => {
    if (isAuthenticated && isHydrated) {
      try {
        console.log('🚀 [Header] 開始載入未讀通知數量')
        const result = await getNotificationsApi()
        
        console.log('📦 [Header] 通知列表 API 回應:', result)
        
        if (result.status && result.data) {
          // 計算 isRead 為 false 的通知數量
          const unreadCount = result.data.filter((notification: any) => !notification.isRead).length
          setUnreadNotificationCount(unreadCount)
          console.log('✅ [Header] 成功載入未讀通知數量:', unreadCount)
        } else {
          console.log('❌ [Header] 載入通知列表失敗')
          setUnreadNotificationCount(0)
        }
      } catch (error) {
        console.error('💥 [Header] 載入未讀通知數量錯誤:', error)
        setUnreadNotificationCount(0)
      }
    } else {
      // 未登入時重置通知數量
      setUnreadNotificationCount(0)
    }
  }

  // 當用戶登入時載入收藏數量和通知數量
  useEffect(() => {
    fetchWishlistCount()
    fetchUnreadNotificationCount()
  }, [isAuthenticated, isHydrated])

  // 監聽收藏變更事件
  useEffect(() => {
    const handleWishlistChange = () => {
      console.log('🔄 [Header] 收到收藏變更事件，重新載入數量')
      fetchWishlistCount()
    }

    // 監聽自定義事件
    window.addEventListener('wishlistChanged', handleWishlistChange)
    
    return () => {
      window.removeEventListener('wishlistChanged', handleWishlistChange)
    }
  }, [isAuthenticated, isHydrated])

  // 監聽通知變更事件
  useEffect(() => {
    const handleNotificationsChange = () => {
      console.log('🔄 [Header] 收到通知變更事件，重新載入數量')
      fetchUnreadNotificationCount()
    }

    // 監聽自定義事件
    window.addEventListener('notificationsChanged', handleNotificationsChange)
    
    return () => {
      window.removeEventListener('notificationsChanged', handleNotificationsChange)
    }
  }, [isAuthenticated, isHydrated])

  // 處理點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProductsDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  // 計算購物車總數量
  const cartItemCount = isHydrated ? items.reduce((total, item) => total + item.quantity, 0) : 0
  // 使用 API 獲取的收藏數量，而非本地 store
  const favoriteCount = wishlistCount

  // 產品分類選項
  const productCategories = [
    { name: "健康生活", href: "/products?category=health" },
    { name: "科學知識", href: "/products?category=science" },
    { name: "藝術啟蒙", href: "/products?category=art" },
    { name: "音樂欣賞", href: "/products?category=music" },
    { name: "勵志成長", href: "/products?category=motivation" }
  ]

  const handleProductsMouseEnter = () => {
    setShowProductsDropdown(true)
  }

  const handleProductsMouseLeave = () => {
    setShowProductsDropdown(false)
  }

  // 獲取用戶頭像 URL
  const userAvatar = user?.avatar || "/images/user_icon/user.png"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4">
      <div className="container-wrapper">
        <div className="bg-white border-8 border-[#F8D0B0] rounded-full py-4 px-4 sm:px-6 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-3">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-28 sm:w-36 h-10 sm:h-12">
              <Image
                src="/images/home/footer_logo.png"
                alt="Little Chapter Logo"
                fill
                sizes="(max-width: 640px) 7rem, 9rem"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Main Menu */}
          <div className="hidden md:flex space-x-3 lg:space-x-6 flex-1 justify-start">
            <Link href="/hot" className="text-gray-900 font-semibold hover:text-orange-500 whitespace-nowrap text-sm lg:text-base">
              熱銷排行
            </Link>
            
            {/* Products Dropdown */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleProductsMouseEnter}
              onMouseLeave={handleProductsMouseLeave}
            >
              <button 
                className="flex items-center text-gray-900 font-semibold hover:text-orange-500 whitespace-nowrap text-sm lg:text-base pb-2"
                aria-expanded={showProductsDropdown}
                aria-haspopup="true"
                onClick={() => setShowProductsDropdown(!showProductsDropdown)}
              >
                探索商品
               
              </button>
              
              {/* Dropdown Menu */}
              {showProductsDropdown && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/5 mt-4 w-32 bg-white border-4 border-[#F8D0B0] rounded-3xl shadow-lg overflow-hidden z-[60] text-center">
                  <div className="py-2">
                    {productCategories.map((category, index) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block px-6 py-3 text-sm font-medium text-gray-900 hover:bg-[#FEF5EE] hover:text-orange-500 transition-colors cursor-pointer"
                        onClick={() => setShowProductsDropdown(false)}
                        onMouseDown={(e) => e.preventDefault()} // 防止點擊時失去焦點
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link href="/about" className="text-gray-900 font-semibold hover:text-orange-500 whitespace-nowrap text-sm lg:text-base">
              關於我們
            </Link>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Search */}
            <div className="relative w-32 sm:w-auto">
              <div className="flex items-center border-4 border-[#F8D0B0] rounded-full pl-2 pr-1 py-1.5">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900 flex-shrink-0" />
                <input type="text" placeholder="搜尋" className="pl-1 pr-1 w-full focus:outline-none text-xs sm:text-sm" />
              </div>
            </div>

            {isAuthenticated ? (
              <>
                {/* My Favorites */}
                <div className="relative flex-shrink-0">
                  <Link href="/account/favorites" className="p-2 hover:bg-[#FEF5EE] rounded-full inline-block">
                    <Heart className="h-7 w-7 sm:h-7 sm:w-7 text-gray-900" />
                    {favoriteCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[#D94A1D] text-white text-xs font-semibold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full">
                        {favoriteCount > 99 ? '99+' : favoriteCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Cart */}
                <div className="relative flex-shrink-0">
                  <Link href="/cart" className="p-2 hover:bg-[#FEF5EE] rounded-full inline-block">
                    <ShoppingCart className="h-7 w-7 sm:h-7 sm:w-7 text-gray-900" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[#D94A1D] text-white text-xs font-semibold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Notifications */}
                <div className="relative flex-shrink-0">
                  <Link href="/account/notifications" className="p-2 hover:bg-[#FEF5EE] rounded-full inline-block">
                    <Bell className="h-7 w-7 sm:h-7 sm:w-7 text-gray-900" />
                    {unreadNotificationCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[#D94A1D] text-white text-xs font-semibold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full">
                        {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* User Icon */}
                <div className="relative flex-shrink-0">
                  <Link href="/account/profile" className="hover:bg-gray-100 rounded-full inline-block">
                    <Image
                      src={userAvatar}
                      alt="User Icon"
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                      onError={(e) => {
                        // 如果頭像載入失敗，使用預設頭像
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/user_icon/user.png";
                      }}
                    />
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Cart for guests */}
                <div className="relative flex-shrink-0">
                  <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full inline-block">
                    <ShoppingCart className="h-7 w-7 sm:h-7 sm:w-7 text-gray-900" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[#D94A1D] text-white text-xs font-semibold w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                  </Link>
                </div>
                
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[#E8652B] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-orange-600 transition-colors shadow-[3px_4px_0px_#74281A] sm:shadow-[4px_6px_0px_#74281A] flex-shrink-0"
                >
                  登入/註冊
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal} 
      />
    </header>
  )
}
