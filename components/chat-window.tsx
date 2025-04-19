"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { X, Send } from "lucide-react"

interface ChatMessage {
  id: number
  text: string
  isUser: boolean
  timestamp: string
}

interface ChatWindowProps {
  onClose: () => void
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "您好！我是小小篇章的客服機器人，有什麼可以幫助您的嗎？",
      isUser: false,
      timestamp: "21:17",
    },
    {
      id: 2,
      text: "我想了解如何選擇適合孩子的書籍",
      isUser: true,
      timestamp: "21:18",
    },
    {
      id: 3,
      text: "您可以根據孩子的年齡、興趣和閱讀水平來選擇適合的書籍。我們的網站提供了按年齡分類的書籍推薦，並且每本書都有詳細的介紹和適讀年齡建議。",
      isUser: false,
      timestamp: "21:18",
    },
  ])

  const [inputText, setInputText] = useState("")
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (inputText.trim() === "") return

    const newUserMessage: ChatMessage = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newUserMessage])
    setInputText("")

    // 模擬機器人回覆
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: messages.length + 2,
        text: "感謝您的提問！我們的客服人員將會盡快回覆您。",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="absolute bottom-24 right-0 w-[400px] h-[680px] bg-[#148A89] rounded-xl shadow-[0px_7px_29px_rgba(100,100,111,0.2)] flex flex-col">
      {/* 聊天室標題 */}
      <div className="w-full h-20 bg-[#2F726D] rounded-t-xl px-6 py-4 flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg">小小篇章客服中心</h3>
        <button onClick={onClose} className="text-white hover:bg-[#1d5854] p-2 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 聊天內容區 */}
      <div ref={chatContainerRef} className="flex-1 bg-white p-4 overflow-y-auto flex flex-col gap-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"} gap-2`}>
            {!message.isUser && (
              <div className="w-8 h-8 rounded-full border-2 border-[#F8D0B0] flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="Chatbot"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <div
                className={`px-4 py-3 max-w-[300px] ${
                  message.isUser
                    ? "bg-[#F3FAF8] rounded-l-2xl rounded-br-2xl ml-auto"
                    : "bg-[#F6F6F6] rounded-r-2xl rounded-bl-2xl"
                }`}
              >
                <p className="text-gray-900">{message.text}</p>
              </div>
              <span className="text-xs text-gray-500">{message.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 客服時間提示 */}
      <div className="w-full h-10 bg-[#FEF5EE] border-y border-[#F8D0B0] flex items-center justify-center">
        <p className="text-[#B4371A]">客服時間：週一至週五09:00~18:00</p>
      </div>

      {/* 輸入區域 */}
      <div className="w-full bg-white p-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="請輸入您的問題..."
            className="flex-1 h-14 px-4 py-3 border-2 border-[#F8D0B0] rounded-full focus:outline-none focus:border-[#E8652B]"
          />
          <button
            onClick={handleSendMessage}
            className="w-10 h-10 bg-[#E8652B] rounded-full flex items-center justify-center"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
