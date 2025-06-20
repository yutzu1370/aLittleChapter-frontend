"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function LinePage() {
  return (
    <>
      <Header />
      <div className="pt-28 pb-20 min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3">
          {/* 返回按鈕 */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm sm:text-base">返回首頁</span>
            </Link>
          </div>

          {/* 主要內容 */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            {/* 標題區域 */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 sm:px-8 py-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10">
                  <path d="M24 12C24 18.6274 18.6274 24 12 24C5.37263 24 0 18.6274 0 12C0 5.37263 5.37263 0 12 0C18.6274 0 24 5.37263 24 12Z" fill="white"/>
                  <path d="M20.0029 11.301C20.0029 7.71642 16.4092 4.79997 11.9918 4.79997C7.57486 4.79997 3.98079 7.71642 3.98079 11.301C3.98079 14.5148 6.83079 17.2061 10.6806 17.715C10.9415 17.7714 11.2966 17.887 11.3864 18.11C11.4671 18.3124 11.4392 18.6298 11.4123 18.8343C11.4123 18.8343 11.3183 19.3996 11.2979 19.5201C11.263 19.7226 11.1369 20.3122 11.9918 19.9521C12.8469 19.5918 16.6053 17.2354 18.286 15.301C19.4469 14.0277 20.0029 12.7357 20.0029 11.301Z" fill="#00C300"/>
                </svg>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold ">
                  加入 LINE 好友
                </h1>
              </div>
              <p className=" text-sm sm:text-base lg:text-lg">
                掃描 QR Code，立即加入我們的 LINE 官方帳號
              </p>
            </div>

            {/* QR Code 區域 */}
            <div className="px-6 sm:px-8 py-6">
              <div className="text-center">
                {/* QR Code 圖片 */}
                <div className="inline-block relative mb-8">
                  <div className="bg-white p-4 rounded-2xl shadow-lg border-4 border-green-100">
                    <Image
                      src="/images/home/line_g.png"
                      alt="LINE QR Code"
                      width={280}
                      height={280}
                      className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-contain"
                      priority
                    />
                  </div>
                  {/* 裝飾性元素 */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-green-300 rounded-full animate-pulse delay-500"></div>
                </div>

                {/* 說明文字 */}
                <div className="max-w-2xl mx-auto space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                    如何加入好友？
                  </h2>
                  
                  <div className="grid gap-4 sm:gap-6">
                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-800 mb-1">開啟 LINE 應用程式</h3>
                        <p className="text-gray-600 text-sm">在您的手機上開啟 LINE 應用程式</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-800 mb-1">掃描 QR Code</h3>
                        <p className="text-gray-600 text-sm">點擊右上角的掃描圖示，對準上方的 QR Code</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-800 mb-1">加入好友</h3>
                        <p className="text-gray-600 text-sm">點擊「加入好友」按鈕，即可完成加入</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
