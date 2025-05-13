"use client"

import { useState } from "react"
import Image from "next/image"
import ChatWindow from "./ChatWindow"

export default function ClientChat() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isChatOpen && <ChatWindow onClose={() => setIsChatOpen(false)} />}

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