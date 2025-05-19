import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface OrderSuccessProps {
  params: {
    orderId: string
  }
}

// 模擬取得訂單資料的函數
async function getOrderDetails(orderId: string) {
  // 這裡應該串接API獲取訂單資料，目前先用模擬資料
  return {
    orderId: orderId,
    transactionId: '2203091509173661',
    amount: 'NT$500',
    paymentMethod: 'WEBATM',
    paymentTime: '2022-03-09 15:09:17',
    items: [
      { id: 1, name: '小貓歷險記', quantity: 1, price: 'NT$300' },
      { id: 2, name: '狗狗遊世界', quantity: 1, price: 'NT$200' }
    ]
  }
}

export default async function OrderSuccessPage({ params }: OrderSuccessProps) {
  const { orderId } = params;
  
  // 訂單ID無效時導向首頁
  if (!orderId ) {
    redirect('/');
  }
  
  const orderDetails = await getOrderDetails(orderId);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 animate-spring-up">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Image 
                src="/images/user_icon/user_icon_1.png" 
                alt="成功" 
                width={50} 
                height={50}
                className="text-green-500"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">付款成功</h1>
          <p className="text-gray-600">感謝您的訂購！我們已收到您的付款</p>
        </div>
        
        <div className="space-y-4 my-6 text-gray-700 bg-orange-50 p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="text-gray-500">訂單編號：</span>
            <span className="font-medium">{orderDetails.orderId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">交易序號：</span>
            <span className="font-medium">{orderDetails.transactionId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">交易金額：</span>
            <span className="font-medium text-[#E8652B]">{orderDetails.amount}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">支付方式：</span>
            <span className="font-medium">{orderDetails.paymentMethod}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">交易時間：</span>
            <span className="font-medium">{orderDetails.paymentTime}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 pb-2">
          <h3 className="font-semibold text-gray-800 mb-3">訂單項目</h3>
          <div className="space-y-2">
            {orderDetails.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-gray-800">{item.name}</span>
                  <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                </div>
                <span className="text-gray-800">{item.price}</span>
              </div>
            ))}
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
