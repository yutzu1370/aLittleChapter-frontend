"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart, Heart, Bell, Menu, X } from "lucide-react"
import { AuthModal } from "@/components/auth/AuthModal"
import { useAuthStore } from "@/lib/store/useAuthStore"
import { useCartStore } from "@/lib/store/useCartStore"
import { useFavoritesStore } from "@/lib/store/useFavoritesStore"
import { getWishlistApi } from "@/lib/api/wishlist"
import { getNotificationsApi } from "@/lib/api/notifications"
import { useRouter } from "next/navigation"
import { useProductSearchStore } from "@/lib/store/useProductSearchStore"
import { getKeywordSuggestionsApi } from "@/lib/api/keyword"

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [showProductsDropdown, setShowProductsDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, user } = useAuthStore()
  const { items } = useCartStore()
  const { getFavoriteCount } = useFavoritesStore()
  const [localSearchKeyword, setLocalSearchKeyword] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const { setSearchKeyword, setActiveCategory } = useProductSearchStore()
  
  // 確保客戶端 hydration 完成
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // 載入收藏數量的函數
  const fetchWishlistCount = async () => {
    if (isAuthenticated && isHydrated) {
      try {
        const result = await getWishlistApi()
        
        if (result.status && result.data) {
          const count = result.data.length
          setWishlistCount(count)
        } else {
          setWishlistCount(0)
        }
      } catch (error) {
        setWishlistCount(0)
      }
    } else {
      setWishlistCount(0)
    }
  }

  // 載入未讀通知數量的函數
  const fetchUnreadNotificationCount = async () => {
    if (isAuthenticated && isHydrated) {
      try {
        const result = await getNotificationsApi()
        
        if (result.status && result.data) {
          const unreadCount = result.data.filter((notification: any) => !notification.isRead).length
          setUnreadNotificationCount(unreadCount)
        } else {
          setUnreadNotificationCount(0)
        }
      } catch (error) {
        setUnreadNotificationCount(0)
      }
    } else {
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
      fetchWishlistCount()
    }

    window.addEventListener('wishlistChanged', handleWishlistChange)
    
    return () => {
      window.removeEventListener('wishlistChanged', handleWishlistChange)
    }
  }, [isAuthenticated, isHydrated])

  // 監聽通知變更事件
  useEffect(() => {
    const handleNotificationsChange = () => {
      fetchUnreadNotificationCount()
    }

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
    { name: "健康生活", href: "/products?category_id=1", id: 1 },
    { name: "科學知識", href: "/products?category_id=2", id: 2 },
    { name: "藝術啟蒙", href: "/products?category_id=3", id: 3 },
    { name: "音樂欣賞", href: "/products?category_id=4", id: 4 },
    { name: "勵志成長", href: "/products?category_id=5", id: 5 }
  ]

  const handleProductsMouseEnter = () => {
    setShowProductsDropdown(true)
  }

  const handleProductsMouseLeave = () => {
    setShowProductsDropdown(false)
  }

  // 獲取用戶頭像 URL
  const userAvatar = user?.avatar || "/images/user_icon/user.png"

  // 檢查是否包含英文字母
  const containsEnglish = (text: string) => {
    return /[a-zA-Z]/.test(text)
  }

  // 串接 n8n webhook 獲取自動補全建議
  const fetchSuggestions = async (keyword: string) => {
    console.log('🔍 開始搜尋建議，關鍵字:', keyword)
    
    // 檢查輸入條件：不能包含英文，且字數不能超過2個字
    if (containsEnglish(keyword)) {
      console.log('❌ 包含英文字母，不呼叫 API')
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    
    if (keyword.length > 2) {
      console.log('❌ 輸入字數超過2個字，不呼叫 API')
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    
    console.log('✅ 通過驗證，準備呼叫 API')
    
    try {
      const suggestions = await getKeywordSuggestionsApi(keyword)
      console.log('📦 [Header] API 回應的建議陣列:', suggestions)
      console.log('📦 [Header] 建議陣列類型:', typeof suggestions)
      console.log('📦 [Header] 是否為陣列:', Array.isArray(suggestions))
      
      if (Array.isArray(suggestions) && suggestions.length > 0) {
        console.log('✅ [Header] 成功獲取建議，數量:', suggestions.length)
        console.log('📝 [Header] 建議內容:', suggestions)
        
        setSuggestions(suggestions)
        setShowSuggestions(true)
      } else {
        console.log('⚠️ [Header] 沒有獲取到有效的建議')
        setSuggestions([])
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('❌ [Header] 獲取搜尋建議失敗:', error)
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log('⌨️ 使用者輸入:', value)
    setLocalSearchKeyword(value)
    
    if (debounceRef.current) {
      console.log('⏰ 清除之前的防抖動計時器')
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      const trimmedValue = value.trim()
      console.log('🕐 防抖動結束，處理輸入:', trimmedValue)
      
      if (trimmedValue) {
        fetchSuggestions(trimmedValue)
      } else {
        console.log('🚫 輸入為空，隱藏建議')
        setShowSuggestions(false)
        setSuggestions([])
      }
    }, 300)
  }

  const handleSearch = () => {
    if (!localSearchKeyword) return
    setShowSuggestions(false)
    // 跳轉到產品頁並帶上 keyword
    router.push(`/products?keyword=${encodeURIComponent(localSearchKeyword)}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSuggestionClick = (s: string) => {
    console.log('🖱️ 使用者點擊建議:', s)
    setLocalSearchKeyword(s)
    setShowSuggestions(false)
    const encodedKeyword = encodeURIComponent(s)
    console.log('🔗 跳轉到搜尋頁面:', `/products?keyword=${encodedKeyword}`)
    router.push(`/products?keyword=${encodedKeyword}`)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-2 sm:py-4">
      <div className="container-wrapper">
        <div className="bg-white border-4 sm:border-8 border-[#F8D0B0] rounded-full py-2 sm:py-4 px-2 sm:px-4 lg:px-6 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-24 h-8 sm:w-28 sm:h-10 lg:w-36 lg:h-12">
              <Image
                src="/images/home/footer_logo.png"
                alt="Little Chapter Logo"
                fill
                sizes="(max-width: 640px) 6rem, (max-width: 1024px) 7rem, 9rem"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-3 xl:space-x-6 flex-1 justify-start">
            <button 
              onClick={() => {
                router.push('/products?is_bestseller=true');
              }}
              className="pb-2 text-gray-900 font-semibold hover:text-orange-500 whitespace-nowrap text-sm xl:text-base"
            >
              熱銷排行
            </button>
            
            {/* Products Dropdown */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleProductsMouseEnter}
              onMouseLeave={handleProductsMouseLeave}
            >
              <button 
                className="flex items-center text-gray-900 font-semibold hover:text-orange-500 whitespace-nowrap text-sm xl:text-base pb-2"
                aria-expanded={showProductsDropdown}
                aria-haspopup="true"
                onClick={() => {
                  if (showProductsDropdown) {
                    setShowProductsDropdown(false);
                  } else {
                    router.push('/products');
                  }
                }}
              >
                探索商品
              </button>
              
              {/* Dropdown Menu */}
              {showProductsDropdown && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/5 mt-4 w-32 bg-white border-4 border-[#F8D0B0] rounded-3xl shadow-lg overflow-hidden z-[60] text-center">
                  <div className="py-2">
                    {productCategories.map((category, index) => (
                      <button
                        key={category.name}
                        className="block w-full  px-6 py-3 text-sm font-medium text-gray-900 hover:bg-[#FEF5EE] hover:text-orange-500 transition-colors cursor-pointer"
                        onClick={() => {
                          setShowProductsDropdown(false);
                          router.push(`/products?category_id=${category.id}`);
                        }}
                        tabIndex={0}
                        aria-label={category.name}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Link href="/about" className="text-gray-900 font-semibold hover:text-orange-500 whitespace-nowrap text-sm xl:text-base">
              關於我們
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-[#FEF5EE] rounded-full"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="開啟選單"
          >
            {showMobileMenu ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {/* Search - Hidden on mobile */}
            <div className="hidden sm:flex relative w-32 lg:w-auto">
              <div className="flex items-center border-2 sm:border-4 border-[#F8D0B0] rounded-full pl-2 pr-1 py-1 sm:py-1.5 bg-white transition-all duration-300 w-40 focus-within:w-64 hover:w-64 hover:border-orange-500">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-900 flex-shrink-0 cursor-pointer" onClick={handleSearch} />
                <input 
                  type="text" 
                  placeholder="搜尋" 
                  className="pl-1 pr-1 w-full focus:outline-none text-xs sm:text-sm bg-white"
                  value={localSearchKeyword}
                  onChange={handleSearchInput}
                  onKeyDown={handleKeyDown}
                  onFocus={() => localSearchKeyword && setShowSuggestions(true)}
                  aria-label="搜尋"
                />
              </div>
              {/* 自動補全建議 dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-10 mt-2 bg-white border-2 border-orange-300 rounded-2xl shadow-lg z-50">
                  {suggestions.map((s, i) => (
                    <div
                      key={s}
                      className="px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-900 rounded-2xl"
                      onClick={() => handleSuggestionClick(s)}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                {/* My Favorites */}
                <div className="relative flex-shrink-0">
                  <Link href="/account/favorites" className="p-1.5 sm:p-2 hover:bg-[#FEF5EE] rounded-full inline-block">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-gray-900" />
                    {favoriteCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[#D94A1D] text-white text-xs font-semibold w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded-full">
                        {favoriteCount > 99 ? '99+' : favoriteCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Cart */}
                <div className="relative flex-shrink-0">
                  <Link href="/cart" className="p-1.5 sm:p-2 hover:bg-[#FEF5EE] rounded-full inline-block">
                    <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-gray-900" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[#D94A1D] text-white text-xs font-semibold w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded-full">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Notifications */}
                <div className="relative flex-shrink-0">
                  <Link href="/account/notifications" className="p-1.5 sm:p-2 hover:bg-[#FEF5EE] rounded-full inline-block">
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-gray-900" />
                    {unreadNotificationCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[#D94A1D] text-white text-xs font-semibold w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded-full">
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
                      className="rounded-full object-cover w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                      onError={(e) => {
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
                  <Link href="/cart" className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full inline-block">
                    <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-gray-900" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-[#D94A1D] text-white text-xs font-semibold w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded-full">
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    )}
                  </Link>
                </div>
                
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[#E8652B] text-white px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-orange-600 transition-colors shadow-[2px_3px_0px_#74281A] sm:shadow-[3px_4px_0px_#74281A] lg:shadow-[4px_6px_0px_#74281A] flex-shrink-0"
                >
                  登入/註冊
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-white border-4 border-[#F8D0B0] rounded-3xl shadow-lg overflow-hidden z-[60]">
            <div className="p-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <div className="flex items-center border-2 border-[#F8D0B0] rounded-full pl-3 pr-2 py-2">
                  <Search className="h-5 w-5 text-gray-900 flex-shrink-0 cursor-pointer" onClick={handleSearch} />
                  <input 
                    type="text" 
                    placeholder="搜尋" 
                    className="pl-2 w-full focus:outline-none text-sm" 
                    value={localSearchKeyword}
                    onChange={handleSearchInput}
                    onKeyDown={handleKeyDown}
                    onFocus={() => localSearchKeyword && setShowSuggestions(true)}
                    aria-label="搜尋"
                  />
                </div>
                {/* 手機版自動補全建議 dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border-2 border-orange-300 rounded-2xl shadow-lg z-50">
                    {suggestions.map((s, i) => (
                      <div
                        key={s}
                        className="px-4 py-2 cursor-pointer hover:bg-orange-50 text-gray-900 rounded-2xl"
                        onClick={() => {
                          handleSuggestionClick(s)
                          setShowMobileMenu(false)
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Mobile Menu Items */}
              <div className="space-y-3">
                <Link 
                  href="/hot" 
                  className="block py-2 text-gray-900 font-semibold hover:text-orange-500 text-base"
                  onClick={() => setShowMobileMenu(false)}
                >
                  熱銷排行
                </Link>
                
                <div className="space-y-2">
                  <div className="text-gray-900 font-semibold text-base py-2">探索商品</div>
                  <div className="pl-4 space-y-2">
                    {productCategories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block py-1.5 text-sm text-gray-600 hover:text-orange-500"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                <Link 
                  href="/about" 
                  className="block py-2 text-gray-900 font-semibold hover:text-orange-500 text-base"
                  onClick={() => setShowMobileMenu(false)}
                >
                  關於我們
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal} 
      />
    </header>
  )
}
