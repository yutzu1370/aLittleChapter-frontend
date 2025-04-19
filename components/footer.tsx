"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-orange-100 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <div className="flex space-x-8">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Fox character"
              width={80}
              height={80}
              className="object-contain"
            />
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Rabbit character"
              width={80}
              height={80}
              className="object-contain"
            />
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Bear character"
              width={80}
              height={80}
              className="object-contain"
            />
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Mouse character"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-amber-800 mb-4">小小篇章</h3>
            <div className="flex items-center mb-2">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Little Chapter Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-sm">LITTLE CHAPTER</span>
            </div>
            <p className="text-xs text-gray-600">專為兒童打造的優質閱讀體驗，提供豐富多元的兒童讀物。</p>
          </div>

          <div>
            <h3 className="font-bold text-amber-800 mb-4">關於我們</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-orange-500">
                  公司簡介
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-500">
                  聯絡我們
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-orange-500">
                  加入我們
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-orange-500">
                  隱私政策
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-amber-800 mb-4">客戶服務</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-orange-500">
                  常見問題
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-orange-500">
                  配送說明
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-orange-500">
                  退換貨政策
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-orange-500">
                  會員權益
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-amber-800 mb-4">聯絡資訊</h3>
            <ul className="space-y-2 text-sm">
              <li>客服電話：(02) 1234-5678</li>
              <li>服務時間：週一至週五 9:00-18:00</li>
              <li>Email：service@littlechapter.com</li>
              <li>
                <div className="flex space-x-3 mt-3">
                  <Link href="#" className="text-gray-600 hover:text-orange-500">
                    <Facebook className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-orange-500">
                    <Instagram className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-orange-500">
                    <Twitter className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-orange-500">
                    <Youtube className="w-5 h-5" />
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-amber-200 pt-6 text-center text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Little Chapter 小小篇章 版權所有</p>
        </div>
      </div>
    </footer>
  )
}
