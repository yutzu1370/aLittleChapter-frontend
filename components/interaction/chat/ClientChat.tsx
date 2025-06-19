"use client"

import { useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import ChatWindow from "./ChatWindow"

export default function ClientChat() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const pathname = usePathname()
  
  // 檢查是否在購物車或結帳頁面
  const isCartOrCheckoutPage = pathname === '/cart' || pathname === '/cart/checkout'

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <div className={`fixed right-4 sm:right-6 z-50 ${
      isCartOrCheckoutPage 
        ? "bottom-[210px] lg:bottom-4 lg:sm:bottom-6" // 購物車和結帳頁面：手機版在固定區塊上方，桌面版正常位置
        : "bottom-4 sm:bottom-6" // 其他頁面：正常位置
    }`}>
      {isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} />}

      <button
        onClick={toggleChat}
        className="w-16 h-16 sm:w-20 sm:h-20 group touch-manipulation"
      >
        <Image
          src={isChatOpen ? "/images/chat/hover_chatbot.png" : "/images/chat/default_chatbot.png"}
          alt="Chatbot"
          width={60}
          height={60}
          style={{ width: "auto", height: "auto" }}
          className="transition-opacity duration-200 group-hover:opacity-80 w-full h-full object-contain"
        />
      </button>
    </div>
  )
}