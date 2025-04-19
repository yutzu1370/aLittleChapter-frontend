"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowUp } from "lucide-react"
import ChatWindow from "./chat-window"

export default function FloatingButtons() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-6 z-50">
      {isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} />}

      <button
        onClick={scrollToTop}
        className="w-20 h-20 bg-white border-4 border-[#82C6BD] rounded-full shadow-[0px_5px_15px_rgba(0,0,0,0.35)] flex items-center justify-center"
      >
        <ArrowUp className="w-12 h-12 text-[#3e8e87]" />
      </button>

      <button
        onClick={toggleChat}
        className="w-20 h-20 bg-white border-4 border-[#F3AE7E] rounded-full shadow-[0px_5px_15px_rgba(0,0,0,0.35)] flex items-center justify-center"
      >
        <Image
          src="/images/icon/icon_chatbot.png"
          alt="Chatbot"
          width={60}
          height={60}
          className="rounded-full"
        />
      </button>
    </div>
  )
}
