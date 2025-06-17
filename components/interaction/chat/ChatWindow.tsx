"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { X, Send } from "lucide-react"
import { sendChatMessage } from "@/lib/api/chat"

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
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

  ])

  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (inputText.trim() === "" || isLoading) return

    const newUserMessage: ChatMessage = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages(prev => [...prev, newUserMessage])
    const userMessage = inputText
    setInputText("")
    setIsLoading(true)

    try {
      // 呼叫後端 API
      const response = await sendChatMessage(userMessage)
      
      let botReply = '感謝您的提問！我們的客服人員將會盡快回覆您。'
      
      if (response.status && response.data?.message) {
        botReply = response.data.message
      } else if (response.message) {
        botReply = response.message
      }
      
      const botResponse: ChatMessage = {
        id: messages.length + 2,
        text: botReply,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      
      const errorResponse: ChatMessage = {
        id: messages.length + 2,
        text: "抱歉，目前無法處理您的訊息，請稍後再試。",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-28 right-6 w-[400px] h-[calc(100vh-240px)] max-h-[600px] bg-[#148A89] rounded-xl shadow-[0px_7px_29px_rgba(100,100,111,0.2)] flex flex-col z-50">
      {/* 聊天室標題 */}
      <div className="w-full h-20 bg-[#2F726D] rounded-t-xl px-6 py-2 flex items-center justify-between">
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
              <div className="w-10 h-10">
                <Image
                  src="/images/chat/default_chatbot.png"
                  alt="Chatbot"
                  width={32}
                  height={32}
                  style={{ width: "auto", height: "auto" }}
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
        
        {/* 載入指示器 */}
        {isLoading && (
          <div className="flex justify-start gap-2">
            <div className="w-10 h-10">
              <Image
                src="/images/chat/default_chatbot.png"
                alt="Chatbot"
                width={32}
                height={32}
                style={{ width: "auto", height: "auto" }}
                className="rounded-full"
              />
            </div>
            <div className="bg-[#F6F6F6] rounded-r-2xl rounded-bl-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
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
            disabled={isLoading}
            className="flex-1 h-14 px-4 py-3 border-2 border-[#F8D0B0] rounded-full focus:outline-none focus:border-[#E8652B] disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || inputText.trim() === ""}
            className="w-10 h-10 bg-[#E8652B] rounded-full flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
