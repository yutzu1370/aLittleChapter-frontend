import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface OrderSuccessProps {
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
    hour12: false
  })
}

export default async function OrderSuccessPage({ params, searchParams }: OrderSuccessProps) {
  const { orderId } = params;
  const { orderNum, serialNum, price, type } = searchParams;
  
  // 訂單ID無效時導向首頁
  if (!orderId) {
    redirect('/');
  }

  // 如果沒有必要的付款資訊，也導向首頁
  if (!orderNum || !serialNum || !price) {
    redirect('/');
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 animate-spring-up">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">付款成功</h1>
          <p className="text-gray-600">感謝您的訂購！我們已收到您的付款</p>
        </div>
        
        <div className="space-y-4 my-6 text-gray-700 bg-orange-50 p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="text-gray-500">訂單編號：</span>
            <span className="font-medium">{orderNum}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">交易序號：</span>
            <span className="font-medium">{serialNum}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">交易金額：</span>
            <span className="font-medium text-[#E8652B]">{formatAmount(price)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">支付方式：</span>
            <span className="font-medium">{formatPaymentMethod(type || '')}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">交易時間：</span>
            <span className="font-medium">{getCurrentTime()}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 pb-2">
          <div className="text-center text-gray-600 text-sm">
            <p>訂單詳細資訊請至會員中心查看</p>
            <p className="mt-1">我們將盡快為您處理並寄出商品</p>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col space-y-3">
          <Link 
            href="/account/orders" 
            className="w-full text-center py-3 px-4 rounded-full bg-[#E8652B] text-white font-semibold shadow-[4px_6px_0px_#74281A] hover:bg-[#d55a24] transition duration-200"
          >
            查看訂單詳情
          </Link>
          <Link 
            href="/" 
            className="w-full text-center py-3 px-4 rounded-full border-2 border-[#F8D0B0] text-gray-700 font-semibold hover:bg-orange-50 transition duration-200"
          >
            繼續購物
          </Link>
        </div>
      </div>
    </div>
  );
}
