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
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
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