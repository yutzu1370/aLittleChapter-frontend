import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface OrderFailProps {
  params: {
    orderId: string
  }
  searchParams: {
    orderNum?: string
    serialNum?: string
    price?: string
    type?: string
  }
}

// 格式化付款方式顯示
function formatPaymentMethod(type: string) {
  switch (type) {
    case 'WEBATM':
      return 'ATM 轉帳'
    case 'CREDIT':
      return '信用卡'
    case 'CVS':
      return '超商付款'
    default:
      return type || '未知'
  }
}

// 格式化金額顯示
function formatAmount(price: string) {
  const numPrice = parseInt(price || '0')
  return `NT$${numPrice.toLocaleString('zh-TW')}`
}

// 格式化當前時間
function getCurrentTime() {
  const now = new Date()
  return now.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Taipei'
  })
}

export default async function OrderFailPage({ params, searchParams }: OrderFailProps) {
  const { orderId } = params;
  const { orderNum, serialNum, price, type } = searchParams;
  
  // 訂單ID無效時導向首頁
  if (!orderId) {
    redirect('/');
  }

  // 如果沒有必要的付款資訊，也導向首頁
  if (!orderNum || !price) {
    redirect('/');
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 animate-spring-up">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">付款失敗</h1>
          <p className="text-sm sm:text-base text-gray-600">很抱歉，您的訂單交易未能完成</p>
        </div>
        
        <div className="space-y-3 sm:space-y-4 my-6 text-gray-700 bg-red-50 p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">訂單編號：</span>
            <span className="text-sm font-medium break-all">{orderNum}</span>
          </div>
          
          {serialNum && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">交易序號：</span>
              <span className="text-sm font-medium break-all">{serialNum}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">交易金額：</span>
            <span className="text-sm font-medium">{formatAmount(price)}</span>
          </div>
          
          {type && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">支付方式：</span>
              <span className="text-sm font-medium">{formatPaymentMethod(type)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">失敗時間：</span>
            <span className="text-sm font-medium">{getCurrentTime()}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 pb-2">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">可能的原因</h3>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-600 list-disc pl-5">
            <li>信用卡資訊有誤或已過期</li>
            <li>銀行系統暫時無法處理交易</li>
            <li>付款金額超出信用卡可用額度</li>
            <li>網路連線不穩定導致交易中斷</li>
            <li>付款時間超過限制</li>
          </ul>
        </div>
        
        <div className="mt-6 sm:mt-8 flex flex-col space-y-3">
          <Link 
            href="/cart/checkout" 
            className="w-full text-center py-3 px-4 rounded-full bg-[#E8652B] text-white font-semibold shadow-[4px_6px_0px_#74281A] hover:bg-[#d55a24] transition duration-200 text-sm sm:text-base"
          >
            重新結帳
          </Link>
          <Link 
            href="/cart" 
            className="w-full text-center py-3 px-4 rounded-full border-2 border-[#F8D0B0] text-gray-700 font-semibold hover:bg-orange-50 transition duration-200 text-sm sm:text-base"
          >
            返回購物車
          </Link>
          <Link 
            href="/" 
            className="w-full text-center py-3 px-4 rounded-full border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition duration-200 text-sm sm:text-base"
          >
            回到首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
