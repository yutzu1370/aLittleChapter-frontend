"use client"

import { useState, useEffect } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { useCartStore } from "@/lib/store/useCartStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import FancyButton from "@/components/ui/FancyButton"
import { ArrowRight, ArrowRightCircle } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface CityData {
  name: string;
  children?: { name: string }[];
}

interface LocationData {
  name: string;
  children: CityData[];
}

export default function CheckoutPage() {
  const router = useRouter()
  const { getSubtotal, getTotal, shippingFee, discount } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState("信用卡")
  const [deviceType, setDeviceType] = useState("手機條碼")
  
  // 縣市與鄉鎮區狀態
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [selectedCity, setSelectedCity] = useState("")
  const [districts, setDistricts] = useState<{ name: string }[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState("")
  
  // 載入地址資料
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch('/data/city.json')
        const data = await response.json()
        setLocationData(data)
      } catch (error) {
        console.error('無法載入縣市資料:', error)
      }
    }
    
    fetchLocationData()
  }, [])
  
  // 當縣市變更時更新鄉鎮區選項
  useEffect(() => {
    if (selectedCity && locationData) {
      const cityData = locationData.children.find(city => city.name === selectedCity)
      if (cityData && cityData.children) {
        setDistricts(cityData.children)
        setSelectedDistrict("")
      } else {
        setDistricts([])
      }
    } else {
      setDistricts([])
    }
  }, [selectedCity, locationData])
  
  // 處理表單提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 提交表單資料到後端 API
    // 然後導向到付款頁面
    router.push("/cart/payment-redirect")
  }

  return (
    <main className="min-h-screen bg-orange-50 font-noto-sans-tc">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 個人資料表單 */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-6 mb-8 shadow-sm">
              <h1 className="text-3xl font-medium text-teal-800 mb-6">寄送資料</h1>
              
              <form id="shipping-form" onSubmit={handleSubmit} className="font-noto-sans-tc">
                <div className="space-y-6">
                  {/* 收件人 */}
                  <div className="flex items-center">
                    <label htmlFor="name" className="text-xl whitespace-nowrap w-24 flex items-center">
                      收件人
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="輸入姓名" 
                      required 
                      className="w-[calc(100%-6rem)] rounded-full border-2 border-gray-300 p-6 text-base font-noto-sans-tc" 
                    />
                  </div>
                
                  {/* 電話 */}
                  <div className="flex items-center">
                    <label htmlFor="phone" className="text-xl whitespace-nowrap w-24 flex items-center">
                      電話
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="輸入電話" 
                      required 
                      className="w-[calc(100%-6rem)] rounded-full border-2 border-gray-300 p-6 text-base font-noto-sans-tc" 
                    />
                  </div>
                  
                  {/* 地址 */}
                  <div className="flex items-center">
                    <label className="text-lg whitespace-nowrap w-24 flex items-center">
                      地址
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex gap-4 w-[calc(100%-6rem)]">
                      <div className="relative w-[130px]">
                        <select 
                          name="city" 
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="appearance-none w-full rounded-full border-2 border-gray-300 px-4 py-2.5 text-base pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-noto-sans-tc"
                        >
                          <option value="">選擇縣市</option>
                          {locationData?.children.map((city) => (
                            <option key={city.name} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L7 7L13 1" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="relative w-[140px]">
                        <select 
                          name="district"
                          value={selectedDistrict}
                          onChange={(e) => setSelectedDistrict(e.target.value)}
                          className="appearance-none w-full rounded-full border-2 border-gray-300 px-4 py-2.5 text-base pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-noto-sans-tc"
                          disabled={!selectedCity}
                        >
                          <option value="">選擇鄉鎮區</option>
                          {districts.map((district) => (
                            <option key={district.name} value={district.name}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L7 7L13 1" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                      
                      <Input 
                        name="address" 
                        placeholder="輸入詳細地址" 
                        className="flex-1 rounded-full border-2 border-gray-300 p-6 text-base font-noto-sans-tc" 
                        required 
                      />
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="flex items-center">
                    <label htmlFor="email" className="text-xl whitespace-nowrap w-24 flex items-center">
                      E-mail
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="輸入E-mail信箱" 
                      required 
                      className="w-[calc(100%-6rem)] rounded-full border-2 border-gray-300 p-6 text-base font-noto-sans-tc" 
                    />
                  </div>
                  
                  {/* 發票類型 */}
                  <div className="flex items-center">
                    <label htmlFor="invoiceType" className="text-xl whitespace-nowrap w-24 flex items-center">
                      發票類型
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative w-[calc(100%-6rem)]">
                      <select 
                        id="invoiceType"
                        name="invoiceType"
                        value={deviceType} 
                        onChange={(e) => setDeviceType(e.target.value)}
                        className="appearance-none w-full rounded-full border-2 border-gray-300 px-4 py-2.5 text-base pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-noto-sans-tc"
                      >
                        <option value="手機條碼">手機條碼</option>
                        <option value="會員載具">會員載具</option>
                        <option value="捐贈發票">捐贈發票</option>
                        <option value="紙本發票">紙本發票</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L7 7L13 1" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* 付款方式 */}
                  <div className="flex items-center">
                    <label htmlFor="paymentMethod" className="text-xl whitespace-nowrap w-24 flex items-center">
                      付款方式
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative w-[calc(100%-6rem)]">
                      <select 
                        id="paymentMethod"
                        name="paymentMethod"
                        value={paymentMethod} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="appearance-none w-full rounded-full border-2 border-gray-300 px-4 py-2.5 text-base pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-noto-sans-tc"
                      >
                        <option value="信用卡">信用卡</option>
                        <option value="ATM匯款">ATM匯款</option>
                        <option value="超商付款">超商付款</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L7 7L13 1" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* 折扣碼 */}
                  <div className="flex items-center">
                    <label htmlFor="discountCode" className="text-xl w-24">折扣碼</label>
                    <div className="flex gap-2 w-[calc(100%-6rem)]">
                      <Input 
                        id="discountCode" 
                        name="discountCode" 
                        placeholder="輸入折扣碼" 
                        className="flex-1 rounded-full border-2 border-gray-300 p-6 text-base font-noto-sans-tc" 
                      />
                      <FancyButton 
                        type="button" 
                        className="px-4 h-auto text-sm font-noto-sans-tc"
                        hideIcons
                      >
                        套用折扣碼
                      </FancyButton>
                    </div>
                  </div>
                  
                  {/* 備註 */}
                  <div className="flex items-start">
                    <label htmlFor="note" className="text-xl w-24 pt-2">備註</label>
                    <Textarea 
                      id="note" 
                      name="note"
                      placeholder="輸入備註內容" 
                      className="w-[calc(100%-6rem)] rounded-xl border-2 border-gray-300 p-4 text-base min-h-[120px] font-noto-sans-tc"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* 總金額區塊 */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="border border-gray-200 rounded-3xl p-6 bg-white shadow-sm font-noto-sans-tc">
                <h2 className="text-xl font-medium text-teal-800 mb-4">總金額</h2>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">小計</span>
                    <span className="text-sm">{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">折扣</span>
                    <span className="text-sm">{formatPrice(discount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">運費</span>
                    <span className="text-sm">{formatPrice(shippingFee)}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 my-4"></div>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="font-medium">應付金額</span>
                  <span className="text-lg font-bold text-amber-600">{formatPrice(getTotal())}</span>
                </div>
                
                <FancyButton 
                  type="submit"
                  form="shipping-form"
                  className="w-full text-lg font-noto-sans-tc" 
                  hideIcons
                  rightIcon={<ArrowRightCircle className="w-8 h-8" strokeWidth={2.5} />}
                >
                  確認付款
                </FancyButton>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
