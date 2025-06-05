"use client"

import { useState, useEffect } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { useCartStore, useCartHydration } from "@/lib/store/useCartStore"
import { useDiscountStore } from "@/lib/store/useDiscountStore"
import { useAuthStore } from "@/lib/store/useAuthStore"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import FancyButton from "@/components/ui/FancyButton"
import { ArrowRight, ArrowRightCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { submitCheckoutApi } from "@/lib/api/checkout"
import { CheckoutRequest, CheckoutItem } from "@/lib/types/checkout"
import { toast } from "sonner"

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
  const { getSubtotal, getAddOnSubtotal } = useCartStore()
  const { appliedDiscount } = useDiscountStore()
  const { isAuthenticated } = useAuthStore()
  const isHydrated = useCartHydration()
  const [isClient, setIsClient] = useState(false)
  const [isAuthHydrated, setIsAuthHydrated] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [deviceType, setDeviceType] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [invoiceTypeError, setInvoiceTypeError] = useState("")
  const [paymentMethodError, setPaymentMethodError] = useState("")
  const [mobileBarcodeError, setMobileBarcodeError] = useState("")
  const [mobileBarcode, setMobileBarcode] = useState("")
  
  // 運費和折扣的本地狀態 - 使用與 CartSummary 相同的邏輯
  const [shippingFee] = useState(60) // 固定運費
  
  // 縣市與鄉鎮區狀態
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [selectedCity, setSelectedCity] = useState("")
  const [districts, setDistricts] = useState<{ name: string }[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState("")
  
  // 處理 Zustand store 水合問題
  useEffect(() => {
    // 等待下一個執行週期，確保 Zustand store 已水合
    const timeout = setTimeout(() => {
      setIsAuthHydrated(true)
    }, 100)
    
    return () => clearTimeout(timeout)
  }, [])
  
  // 標記客戶端渲染完成
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // 確保在客戶端渲染和水合後再進行認證檢查
  useEffect(() => {
    if (!isClient || !isAuthHydrated) return
    
    // 驗證使用者是否已登入，未登入則立即重定向到首頁
    if (!isAuthenticated) {
      toast.error('請先登入', {
        description: '您需要先登入才能進行結帳',
        duration: 3000
      })
      router.replace("/")
    }
  }, [isAuthenticated, isClient, isAuthHydrated, router])
  
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
  
  // 驗證電話號碼
  const validatePhone = (phone: string) => {
    const phoneRegex = /^09\d{8}$/
    if (!phone) {
      setPhoneError("")
      return true
    }
    if (!phoneRegex.test(phone)) {
      setPhoneError("請輸入正確的手機號碼格式（09開頭的10位數字）")
      return false
    }
    setPhoneError("")
    return true
  }

  // 驗證 Email 格式
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("")
      return true
    }
    if (!emailRegex.test(email)) {
      setEmailError("請輸入正確的 Email 格式")
      return false
    }
    setEmailError("")
    return true
  }

  // 驗證手機條碼格式
  const validateMobileBarcode = (barcode: string) => {
    const barcodeRegex = /^\/[A-Z0-9.\-+]{7}$/
    if (!barcode) {
      setMobileBarcodeError("")
      return true
    }
    if (!barcodeRegex.test(barcode)) {
      setMobileBarcodeError("請輸入正確格式：首碼為/加7碼英數字共8碼")
      return false
    }
    setMobileBarcodeError("")
    return true
  }
  
  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 重置錯誤狀態
    setInvoiceTypeError("")
    setPaymentMethodError("")
    setMobileBarcodeError("")
    
    let hasError = false
    let errorMessages: string[] = []
    
    // 驗證發票類型
    if (!deviceType || deviceType === "") {
      setInvoiceTypeError("請選擇發票類型")
      errorMessages.push("請選擇發票類型")
      hasError = true
    }
    
    // 驗證手機條碼（當選擇電子發票時）
    if (deviceType === "電子發票") {
      if (!mobileBarcode || mobileBarcode.trim() === "") {
        setMobileBarcodeError("請填寫手機條碼載具")
        errorMessages.push("請填寫手機條碼載具")
        hasError = true
      } else if (!validateMobileBarcode(mobileBarcode)) {
        errorMessages.push("手機條碼格式不正確")
        hasError = true
      }
    }
    
    // 驗證付款方式
    if (!paymentMethod || paymentMethod === "") {
      setPaymentMethodError("請選擇付款方式")
      errorMessages.push("請選擇付款方式")
      hasError = true
    }
    
    // 如果有錯誤，顯示 toast 並不提交表單
    if (hasError) {
      toast.error('表單填寫有誤', {
        description: errorMessages.join('、'),
        duration: 4000
      })
      return
    }
    
    // 獲取表單資料
    const formData = new FormData(e.target as HTMLFormElement)
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const city = formData.get('city') as string
    const district = formData.get('district') as string
    const address = formData.get('address') as string
    const note = formData.get('note') as string
    
    // 驗證必要欄位
    if (!name || !phone || !email || !city || !district || !address) {
      toast.error('請填寫所有必要欄位', {
        description: '請確認收件人、電話、Email 和地址等必要資訊已完整填寫'
      })
      return
    }
    
    // 獲取購物車資料
    const { items, addedOnItems } = useCartStore.getState()
    const selectedItems = items.filter(item => item.isSelected)
    
    if (selectedItems.length === 0 && addedOnItems.length === 0) {
      toast.error('購物車是空的，無法結帳', {
        description: '請先將商品加入購物車後再進行結帳'
      })
      return
    }
    
    // 準備商品項目資料
    const checkoutItems: CheckoutItem[] = [
      // 一般商品
      ...selectedItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.discountPrice
      })),
      // 加購商品
      ...addedOnItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity || 1,
        price: item.addOnPrice
      }))
    ]
    
    // 計算金額
    const subtotal = getSubtotal()
    const addOnSubtotal = getAddOnSubtotal()
    const discount = appliedDiscount?.discountAmount || 0
    const finalAmount = subtotal + addOnSubtotal + shippingFee - discount
    
    // 準備結帳資料
    const checkoutData: CheckoutRequest = {
      totalAmount: subtotal + addOnSubtotal,
      discountAmount: discount,
      shippingFee: shippingFee,
      finalAmount: finalAmount,
      discountCode: appliedDiscount?.code,
      items: checkoutItems,
      paymentMethod: paymentMethod === '信用卡' ? 'CREDIT' : paymentMethod === 'ATM匯款' ? 'WEBATM' : 'CREDIT',
      shippingMethod: 'homeDelivery',
      recipientName: name,
      recipientEmail: email,
      recipientPhone: phone,
      shippingAddress: `${city}${district}${address}`,
      invoiceType: deviceType === '電子發票' ? 'e-invoice' : deviceType === '紙本發票' ? 'paper' : deviceType,
      ...(deviceType === '電子發票' && mobileBarcode ? { carrierNum: mobileBarcode } : {}),
      note: note || undefined
    }
    
    // 檢查折扣碼和結帳資料
    console.log('=== 結帳資料檢查 ===')
    console.log('appliedDiscount:', appliedDiscount)
    console.log('折扣碼:', appliedDiscount?.code)
    console.log('折扣金額:', discount)
    console.log('完整結帳資料:', checkoutData)
    console.log('==================')
    
    try {
      // 調用結帳API
      const paymentInfo = await submitCheckoutApi(checkoutData)
      
      // 顯示成功訊息
      toast.success('結帳成功', {
        description: '正在跳轉至付款頁面，請稍候...',
        duration: 2000
      })
      
      // 結帳成功，將付款資料傳遞給 payment-redirect 頁面
      const paymentData = {
        status: true,
        message: "轉向第三方金流處理付款",
        data: paymentInfo
      }
      
      // 將付款資料編碼為 URL 參數
      const encodedData = encodeURIComponent(JSON.stringify(paymentData))
      router.push(`/cart/payment-redirect?jsonData=${encodedData}`)
    } catch (error) {
      console.error('結帳錯誤:', error)
      const errorMessage = error instanceof Error ? error.message : '結帳過程中發生錯誤，請稍後再試'
      
      toast.error('結帳失敗', {
        description: errorMessage,
        duration: 5000
      })
    }
  }

  // 計算最終總額 - 包含加購商品和折扣
  const calculateFinalTotal = () => {
    const subtotal = getSubtotal()
    const addOnSubtotal = getAddOnSubtotal()
    const discount = appliedDiscount?.discountAmount || 0
    return subtotal + addOnSubtotal + shippingFee - discount
  }

  // 未完成客戶端渲染或水合，或未登入時顯示載入中
  if (!isClient || !isAuthHydrated || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white font-noto-sans-tc">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 個人資料表單 */}
          <div className="md:col-span-2">
            <div className="border border-gray-200 bg-white rounded-3xl p-6 mb-8 shadow-sm">
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
                      name="name"
                      type="text" 
                      placeholder="輸入姓名" 
                      required 
                      className="w-[calc(100%-6rem)] rounded-full border-2 border-gray-300 p-6 text-base font-noto-sans-tc placeholder:text-gray-600"
                      style={{
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#f59e0b';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                      }}
                    />
                  </div>
                
                  {/* 電話 */}
                  <div className="flex items-center">
                    <label htmlFor="phone" className="text-xl whitespace-nowrap w-24 flex items-center">
                      電話
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="w-[calc(100%-6rem)]">
                      <Input 
                        id="phone" 
                        name="phone"
                        type="tel" 
                        placeholder="輸入電話" 
                        required 
                        maxLength={10}
                        className="w-full rounded-full border-2 border-gray-300 p-6 text-base font-noto-sans-tc placeholder:text-gray-600"
                        style={{
                          outline: 'none'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#f59e0b';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          validatePhone(e.target.value);
                        }}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ''); // 只允許數字
                          e.target.value = value;
                          if (phoneError) validatePhone(value);
                        }}
                      />
                      {phoneError && (
                        <p className="text-red-500 text-sm mt-1 ml-4">{phoneError}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* 地址 */}
                  <div className="flex items-center">
                    <label className="text-xl whitespace-nowrap w-24 flex items-center ">
                      地址
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex gap-4 w-[calc(100%-6rem)]">
                      <div className="relative w-[130px]">
                        <select 
                          name="city" 
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className={`appearance-none w-full rounded-full border-2 border-gray-300 px-4 py-2.5 text-base pr-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-transparent font-noto-sans-tc ${selectedCity ? 'text-black' : 'text-gray-600'}`}
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
                          className={`appearance-none w-full rounded-full border-2 border-gray-300 px-4 py-2.5 text-base pr-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-transparent font-noto-sans-tc ${selectedDistrict ? 'text-black' : 'text-gray-600'}`}
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
                        className="flex-1 rounded-full border-2 border-gray-300 p-6 text-base font-noto-sans-tc placeholder:text-gray-600"
                        style={{
                          outline: 'none'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#f59e0b';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                        }}
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
                    <div className="w-[calc(100%-6rem)]">
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="輸入E-mail信箱" 
                        required 
                        className="w-full rounded-full border-2 border-gray-300 p-6 text-base font-noto-sans-tc placeholder:text-gray-600"
                        style={{
                          outline: 'none'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#f59e0b';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#d1d5db';
                          validateEmail(e.target.value);
                        }}
                        onChange={(e) => {
                          if (emailError) validateEmail(e.target.value);
                        }}
                      />
                      {emailError && (
                        <p className="text-red-500 text-sm mt-1 ml-4">{emailError}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* 發票類型 */}
                  <div className="flex items-center">
                    <label htmlFor="invoiceType" className="text-xl whitespace-nowrap w-24 flex items-center">
                      發票類型
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="flex gap-4 w-[calc(100%-6rem)]">
                      <div className="relative w-[280px]">
                        <select 
                          id="invoiceType"
                          name="invoiceType"
                          value={deviceType} 
                          onChange={(e) => {
                            setDeviceType(e.target.value)
                            if (invoiceTypeError) setInvoiceTypeError("")
                            // 當改變發票類型時，清空手機條碼
                            if (e.target.value !== "電子發票") {
                              setMobileBarcode("")
                              setMobileBarcodeError("")
                            }
                          }}
                          className={`appearance-none w-full rounded-full border-2 border-gray-300 px-4 py-2.5 text-base pr-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-transparent font-noto-sans-tc ${deviceType ? 'text-black' : 'text-gray-600'}`}
                        >
                          <option value="">請選擇</option>
                          <option value="電子發票">電子發票-請填寫手機條碼載具</option>
                          <option value="紙本發票">紙本發票-同寄送地址</option>
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L7 7L13 1" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        {invoiceTypeError && (
                          <p className="text-red-500 text-sm mt-1 ml-4">{invoiceTypeError}</p>
                        )}
                      </div>
                      
                      {/* 手機條碼輸入欄 - 與選項在同一行 */}
                      {deviceType === "電子發票" && (
                        <div className="flex-1">
                          <Input 
                            name="mobileBarcode" 
                            value={mobileBarcode}
                            placeholder="首碼為/加7碼英數字共8碼" 
                            maxLength={8}
                            className="w-full rounded-full border-2 border-gray-300 p-6 text-base font-noto-sans-tc placeholder:text-gray-600"
                            style={{
                              outline: 'none'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#f59e0b';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#d1d5db';
                              validateMobileBarcode(mobileBarcode);
                            }}
                            onInput={(e) => {
                              const target = e.target as HTMLInputElement;
                              const inputValue = target.value;
                              
                              // 如果輸入為空，直接設置
                              if (!inputValue) {
                                setMobileBarcode("");
                                return;
                              }
                              
                              let processedValue = inputValue;
                              
                              // 移除所有不允許的字符
                              processedValue = processedValue.replace(/[^\/a-zA-Z0-9.\-+]/g, '');
                              
                              // 轉換為大寫
                              processedValue = processedValue.toUpperCase();
                              
                              // 如果不是以 / 開頭，自動加上
                              if (processedValue && !processedValue.startsWith('/')) {
                                processedValue = '/' + processedValue.replace(/\//g, '');
                              }
                              
                              // 限制長度
                              if (processedValue.length > 8) {
                                processedValue = processedValue.substring(0, 8);
                              }
                              
                              setMobileBarcode(processedValue);
                              
                              if (mobileBarcodeError) {
                                validateMobileBarcode(processedValue);
                              }
                            }}
                            onChange={() => {
                              // 空的 onChange 以滿足 React 的要求
                            }}
                          />
                          {mobileBarcodeError && (
                            <p className="text-red-500 text-sm mt-1 ml-4">{mobileBarcodeError}</p>
                          )}
                        </div>
                      )}
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
                        onChange={(e) => {
                          setPaymentMethod(e.target.value)
                          if (paymentMethodError) setPaymentMethodError("")
                        }}
                        className={`appearance-none w-full rounded-full border-2 border-gray-300 px-4 py-2.5 text-base pr-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:border-transparent font-noto-sans-tc ${paymentMethod ? 'text-black' : 'text-gray-600'}`}
                      >
                        <option value="">請選擇</option>
                        <option value="信用卡">信用卡</option>
                        <option value="ATM匯款">ATM匯款</option>
                        <option value="超商付款">超商付款</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 1L7 7L13 1" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      {paymentMethodError && (
                        <p className="text-red-500 text-sm mt-1 ml-4">{paymentMethodError}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* 備註 */}
                  <div className="flex items-start">
                    <label htmlFor="note" className="text-xl w-24 pt-2">備註</label>
                    <Textarea 
                      id="note" 
                      name="note"
                      placeholder="輸入備註內容" 
                      className="w-[calc(100%-6rem)] rounded-xl border-2 border-gray-300 p-4 text-base min-h-[120px] font-noto-sans-tc placeholder:text-gray-600"
                      style={{
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#f59e0b';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                      }}
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
                    <span className="text-sm">商品小計</span>
                    <span className="text-sm">
                      <span className="font-jf-openhuninn">${getSubtotal().toLocaleString('zh-TW')}</span>
                    </span>
                  </div>
                  {getAddOnSubtotal() > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">加購商品小計</span>
                      <span className="text-sm">
                        <span className="font-jf-openhuninn">${getAddOnSubtotal().toLocaleString('zh-TW')}</span>
                      </span>
                    </div>
                  )}
                  {appliedDiscount && (
                    <div className="flex justify-between items-center text-[#509D94]">
                      <span className="text-sm">折扣 ({appliedDiscount.code})</span>
                      <span className="text-sm">
                        <span className="font-jf-openhuninn">-${appliedDiscount.discountAmount.toLocaleString('zh-TW')}</span>
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm">運費</span>
                    <span className="text-sm">
                      <span className="font-jf-openhuninn">${shippingFee.toLocaleString('zh-TW')}</span>
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 my-4"></div>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="font-medium">應付金額</span>
                  <span className="text-lg font-bold text-amber-600">
                    <span className="font-jf-openhuninn">${calculateFinalTotal().toLocaleString('zh-TW')}</span>
                  </span>
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
