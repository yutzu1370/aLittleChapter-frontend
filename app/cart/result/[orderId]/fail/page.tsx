import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface OrderFailProps {
  params: {
    orderId: string
  }
}

// 模擬取得失敗訂單資料的函數
async function getFailedOrderDetails(orderId: string) {
  // 這裡應該串接API獲取訂單資料，目前先用模擬資料
  return {
    orderId: orderId,
    errorCode: 'MPG01002',
    errorMessage: '交易失敗',
    amount: 'NT$500',
    paymentMethod: 'WEBATM',
    failTime: '2022-03-09 15:09:17'
  }
}

export default async function OrderFailPage({ params }: OrderFailProps) {
  const { orderId } = params;
  
  // 訂單ID無效時導向首頁
  if (!orderId) {
    redirect('/');
  }
  
  const orderDetails = await getFailedOrderDetails(orderId);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 animate-spring-up">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-10 w-10 text-red-500" 
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{orderDetails.errorCode}：{orderDetails.errorMessage}</h1>
          <p className="text-gray-600">很抱歉，您的訂單交易未能完成</p>
        </div>
        
        <div className="space-y-4 my-6 text-gray-700 bg-red-50 p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="text-gray-500">訂單編號：</span>
            <span className="font-medium">{orderDetails.orderId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">錯誤代碼：</span>
            <span className="font-medium text-red-500">{orderDetails.errorCode}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">交易金額：</span>
            <span className="font-medium">{orderDetails.amount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">支付方式：</span>
            <span className="font-medium">{orderDetails.paymentMethod}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">失敗時間：</span>
            <span className="font-medium">{orderDetails.failTime}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 pb-2">
          <h3 className="font-semibold text-gray-800 mb-3">可能的原因</h3>
          <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
            <li>信用卡資訊有誤或已過期</li>
            <li>銀行系統暫時無法處理交易</li>
            <li>付款金額超出信用卡可用額度</li>
            <li>網路連線不穩定導致交易中斷</li>
          </ul>
        </div>
        
        <div className="mt-8 flex flex-col space-y-3">
          <Link 
            href="/cart" 
            className="w-full text-center py-3 px-4 rounded-full bg-[#E8652B] text-white font-semibold shadow-[4px_6px_0px_#74281A] hover:bg-[#d55a24] transition duration-200"
          >
            返回購物車
          </Link>
          <Link 
            href="/" 
            className="w-full text-center py-3 px-4 rounded-full border-2 border-[#F8D0B0] text-gray-700 font-semibold hover:bg-orange-50 transition duration-200"
          >
            回到首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
