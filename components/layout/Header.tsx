"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ShoppingCart, Heart, Bell } from "lucide-react"
import { AuthModal } from "@/components/auth/AuthModal"
import { useAuthStore } from "@/lib/store/useAuthStore"

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isAuthenticated } = useAuthStore()

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
              />
            </div>
          </Link>

          {/* Main Menu */}
          <div className="hidden md:flex space-x-3 lg:space-x-6 flex-1 justify-start">
            <Link href="/hot" className="text-gray-900 font-semibold hover:text-orange-500 whitespace-nowrap text-sm lg:text-base">
              熱銷排行
            </Link>
            <Link href="/products" className="text-gray-900 font-semibold hover:text-orange-500 whitespace-nowrap text-sm lg:text-base">
              探索商品
            </Link>
            <Link href="/about" className="text-gray-900 font-semibold hover:text-orange-500 whitespace-nowrap text-sm lg:text-base">
              關於我們
            </Link>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Search */}
            <div className="relative w-32 sm:w-auto">
              <div className="flex items-center border-4 border-[#F8D0B0] rounded-full pl-2 pr-1 py-1.5">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900 flex-shrink-0" />
                <input type="text" placeholder="搜尋" className="pl-1 pr-1 w-full focus:outline-none text-xs sm:text-sm" />
              </div>
            </div>

            {isAuthenticated ? (
              <>
                {/* My Favorites */}
                <div className="relative flex-shrink-0">
                  <Link href="/favorites" className="p-2 hover:bg-gray-100 rounded-full inline-block">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
                  </Link>
                </div>

                {/* Cart */}
                <div className="relative flex-shrink-0">
                  <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full inline-block">
                    <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
                    <span className="absolute -top-0.5 -right-0.5 bg-[#D94A1D] text-white text-xs font-semibold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                      2
                    </span>
                  </Link>
                </div>

                {/* Notifications */}
                <div className="relative flex-shrink-0">
                  <Link href="/notifications" className="p-2 hover:bg-gray-100 rounded-full inline-block">
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
                    <span className="absolute -top-0.5 -right-0.5 bg-[#D94A1D] text-white text-xs font-semibold w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
                      8
                    </span>
                  </Link>
                </div>

                {/* User Icon */}
                <div className="relative flex-shrink-0">
                  <Link href="/account/profile" className="hover:bg-gray-100 rounded-full inline-block">
                    <Image
                      src="/images/user_icon/user_icon_3.png"
                      alt="User Icon"
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </Link>
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-[#E8652B] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-orange-600 transition-colors shadow-[3px_4px_0px_#74281A] sm:shadow-[4px_6px_0px_#74281A] flex-shrink-0"
              >
                登入/註冊
              </button>
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
