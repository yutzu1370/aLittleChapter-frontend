"use client"

import { ArrowUp } from "lucide-react"
import { usePathname } from "next/navigation"

export default function FloatingButtons() {
  const pathname = usePathname()
  
  // 檢查是否在購物車或結帳頁面
  const isCartOrCheckoutPage = pathname === '/cart' || pathname === '/cart/checkout'
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div className={`fixed right-6 sm:right-10 z-50 ${
      isCartOrCheckoutPage 
        ? "bottom-[280px] lg:bottom-24 lg:sm:bottom-[115px]" // 購物車和結帳頁面：手機版在固定區塊上方，桌面版正常位置
        : "bottom-24 sm:bottom-[115px]" // 其他頁面：正常位置
    }`}>
      <button
        onClick={scrollToTop}
        className="w-12 h-12 sm:w-15 sm:h-15 bg-white border-2 sm:border-4 border-[#82C6BD] rounded-full shadow-[0px_3px_10px_rgba(0,0,0,0.25)] sm:shadow-[0px_5px_15px_rgba(0,0,0,0.35)] flex items-center justify-center touch-manipulation"
      >
        <ArrowUp className="w-8 h-8 sm:w-12 sm:h-12 text-[#3e8e87]" />
      </button>
    </div>
  )
}
