"use client"

import Image from "next/image"
import Link from "next/link"
import { Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-6 bg-[#FEF5EE] rounded-t-3xl">
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 flex space-x-8 z-10">
        <Image
          src="/images/home/Rabbit.png"
          alt="Rabbit"
          width={160}
          height={160}
          className="object-contain h-40 w-40"
        />
        <Image
          src="/images/home/Fox.png"
          alt="Fox"
          width={160}
          height={160}
          className="object-contain h-40 w-40"
        />
        <Image
          src="/images/home/Mouse.png"
          alt="Mouse"
          width={160}
          height={160}
          className="object-contain h-40 w-40"
        />
        <Image
          src="/images/home/Bear.png"
          alt="Bear"
          width={160}
          height={160}
          className="object-contain h-40 w-40"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-4 mb-8 justify-items-center">
          <div>
            <div className="flex items-center mb-2">
              <Image
                src="/images/home/footer_logo.png"
                alt="Little Chapter Logo"
                width={48}
                height={48}
                className="mr-2 w-full object-cover"
              />
              <div>
              </div>
            </div>
            <div className="flex space-x-3 mt-2 justify-center">
              <Link href="#" className="text-gray-600 hover:text-orange-500">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                  <circle cx="16" cy="16" r="16" fill="#000"/>
                  <path d="M21.333 16.001h-3.2v8h-3.2v-8h-2.133v-2.667h2.133v-1.6c0-2.133 1.067-3.2 3.2-3.2h2.133v2.667h-1.6c-.267 0-.533.267-.533.533v1.6h2.133l-.267 2.667z" fill="white"/>
                </svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-orange-500">
                <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                  <rect x="2" y="2" width="28" height="28" rx="7" fill="#000"/>
                  <rect x="9" y="9" width="14" height="14" rx="7" stroke="white" strokeWidth="2" fill="none"/>
                  <circle cx="16" cy="16" r="4.5" stroke="white" strokeWidth="2" fill="none"/>
                  <circle cx="22.5" cy="9.5" r="1.5" fill="white"/>
                </svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-orange-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <path d="M24 12C24 18.6274 18.6274 24 12 24C5.37263 24 0 18.6274 0 12C0 5.37263 5.37263 0 12 0C18.6274 0 24 5.37263 24 12Z" fill="#121212"/>
                  <path d="M20.0029 11.301C20.0029 7.71642 16.4092 4.79997 11.9918 4.79997C7.57486 4.79997 3.98079 7.71642 3.98079 11.301C3.98079 14.5148 6.83079 17.2061 10.6806 17.715C10.9415 17.7714 11.2966 17.887 11.3864 18.11C11.4671 18.3124 11.4392 18.6298 11.4123 18.8343C11.4123 18.8343 11.3183 19.3996 11.2979 19.5201C11.263 19.7226 11.1369 20.3122 11.9918 19.9521C12.8469 19.5918 16.6053 17.2354 18.286 15.301C19.4469 14.0277 20.0029 12.7357 20.0029 11.301Z" fill="white"/>
                  <path d="M17.3378 13.3709C17.4223 13.3709 17.4907 13.3025 17.4907 13.218V12.6499C17.4907 12.5658 17.4219 12.497 17.3378 12.497H15.8082V11.9069H17.3378C17.4223 11.9069 17.4907 11.8384 17.4907 11.7539V11.1858C17.4907 11.1017 17.4219 11.0329 17.3378 11.0329H15.8082V10.4429H17.3378C17.4223 10.4429 17.4907 10.3744 17.4907 10.2899V9.72182C17.4907 9.63775 17.4219 9.5689 17.3378 9.5689H15.0871C15.0026 9.5689 14.9341 9.63737 14.9341 9.72182V13.218C14.9341 13.3025 15.0026 13.3709 15.0871 13.3709H17.3378Z" fill="#121212"/>
                  <path d="M9.01245 13.3709C9.09698 13.3709 9.16545 13.3025 9.16545 13.218V12.6499C9.16545 12.5658 9.0966 12.497 9.01245 12.497H7.48283V9.72182C7.48283 9.63775 7.41405 9.5689 7.3299 9.5689H6.76178C6.67725 9.5689 6.60885 9.63737 6.60885 9.72182V13.218C6.60885 13.3025 6.67725 13.3709 6.76178 13.3709H9.01245Z" fill="#121212"/>
                  <path d="M10.3674 9.56888H9.79924C9.71479 9.56888 9.64631 9.63736 9.64631 9.72181V13.218C9.64631 13.3025 9.71479 13.3709 9.79924 13.3709H10.3674C10.4519 13.3709 10.5204 13.3025 10.5204 13.218V9.72181C10.5204 9.63736 10.4519 9.56888 10.3674 9.56888Z" fill="#121212"/>
                  <path d="M14.2351 9.56888H13.6669C13.5825 9.56888 13.514 9.63736 13.514 9.72181V11.7984L11.9144 9.63818C11.9107 9.63263 11.9065 9.62731 11.9021 9.62236C11.9018 9.62198 11.9014 9.62161 11.9011 9.62123C11.8981 9.61793 11.8951 9.61471 11.8919 9.61163C11.8909 9.61081 11.8899 9.60998 11.889 9.60908C11.8863 9.60668 11.8835 9.60436 11.8807 9.60203C11.8793 9.60106 11.878 9.60001 11.8765 9.59896C11.874 9.59708 11.8712 9.59521 11.8684 9.59341C11.8669 9.59236 11.8654 9.59153 11.8638 9.59056C11.861 9.58898 11.8582 9.58733 11.8554 9.58598C11.8537 9.58508 11.8522 9.58433 11.8504 9.58351C11.8475 9.58223 11.8446 9.58088 11.8415 9.57976C11.8399 9.57908 11.8382 9.57848 11.8366 9.57788C11.8335 9.57676 11.8304 9.57586 11.8273 9.57488C11.8255 9.57436 11.8237 9.57391 11.8219 9.57353C11.8188 9.57278 11.8158 9.57211 11.8127 9.57151C11.8106 9.57113 11.8084 9.57083 11.8063 9.57053C11.8035 9.57016 11.8008 9.56978 11.798 9.56956C11.7953 9.56933 11.7926 9.56918 11.7898 9.56911C11.7881 9.56911 11.7864 9.56888 11.7846 9.56888H11.2196C11.1351 9.56888 11.0666 9.63736 11.0666 9.72181V13.218C11.0666 13.3025 11.1351 13.3709 11.2196 13.3709H11.7877C11.8722 13.3709 11.9407 13.3025 11.9407 13.218V11.1422L13.5423 13.305C13.5533 13.3206 13.5668 13.3334 13.5817 13.3436C13.5823 13.344 13.5829 13.3445 13.5835 13.3448C13.5866 13.3469 13.5898 13.3488 13.5931 13.3507C13.5946 13.3515 13.596 13.3523 13.5976 13.3531C13.6 13.3544 13.6024 13.3556 13.605 13.3567C13.6075 13.3578 13.6099 13.3589 13.6125 13.3599C13.6141 13.3606 13.6157 13.3611 13.6174 13.3616C13.6208 13.3629 13.6243 13.3641 13.6279 13.365C13.6286 13.3652 13.6294 13.3655 13.6301 13.3656C13.6429 13.369 13.6562 13.3709 13.6701 13.3709H14.2351C14.3195 13.3709 14.388 13.3025 14.388 13.218V9.72181C14.388 9.63736 14.3195 9.56888 14.2351 9.56888Z" fill="#121212"/>
                </svg>
              </Link>
            </div>
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
