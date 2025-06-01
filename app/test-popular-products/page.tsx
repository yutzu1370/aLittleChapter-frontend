"use client"

import { useState, useEffect } from "react"
import { fetchAddOnItems, getRandomAddOnItems } from "@/lib/api/addOnItem"
import { useLoadAddOns } from "@/lib/store/useCartStore"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import AddOnItem from "@/components/cart/AddOnItem"

// 加購商品類型（與useCartStore中的類型一致）
interface AddOnItem {
  productId: number;
  name: string;
  price: number;
  addOnPrice: number;
  imageUrl: string;
  quantity?: number;
}

export default function TestPopularProductsPage() {
  const [addOnItems, setAddOnItems] = useState<AddOnItem[]>([]);
  const [randomAddOns, setRandomAddOns] = useState<AddOnItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addOns, isLoadingAddOns } = useLoadAddOns();

  const handleFetchPopularProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('開始獲取加購商品...');
      const items = await fetchAddOnItems();
      console.log('獲取到的加購商品:', items);
      
      setAddOnItems(items);
      
      // 隨機選取4個商品
      const selected = getRandomAddOnItems(items, 4);
      console.log('隨機選取的加購商品:', selected);
      setRandomAddOns(selected);
      
    } catch (err) {
      console.error('獲取加購商品失敗:', err);
      setError(err instanceof Error ? err.message : '未知錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 頁面載入時自動獲取一次
    handleFetchPopularProducts();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-teal-800 mb-8 text-center">熱門商品API測試</h1>
        
        <div className="space-y-8">
          {/* 控制按鈕 */}
          <div className="text-center">
            <button
              onClick={handleFetchPopularProducts}
              disabled={isLoading}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
            >
              {isLoading ? '載入中...' : '重新獲取熱門商品'}
            </button>
          </div>

          {/* 錯誤訊息 */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>錯誤：</strong> {error}
            </div>
          )}

          {/* API 回應的所有加購商品 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-2xl font-medium text-teal-800 mb-6">
              API 回應的所有加購商品 ({addOnItems.length} 個)
            </h2>
            
            {addOnItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">暫無資料</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {addOnItems.map((item) => (
                  <div key={item.productId} className="border rounded-lg p-4">
                    <div className="aspect-square relative w-full rounded-lg overflow-hidden mb-3 bg-gray-100">
                      <img 
                        src={item.imageUrl || "/images/books/placeholder.jpg"} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/books/placeholder.jpg";
                        }}
                      />
                    </div>
                    <h3 className="font-medium text-teal-800 mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600">ID: {item.productId}</p>
                    <p className="text-sm text-gray-600">原價: NT${item.price}</p>
                    <p className="text-sm text-gray-600">加購價: NT${item.addOnPrice}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 隨機選取的4個商品 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-2xl font-medium text-teal-800 mb-6">
              隨機選取的4個商品 ({randomAddOns.length} 個)
            </h2>
            
            {randomAddOns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">暫無資料</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {randomAddOns.map((item) => (
                  <AddOnItem 
                    key={item.productId} 
                    item={item}
                    onAddToCart={() => console.log('加入購物車:', item.name)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 購物車Store中的加購商品 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-2xl font-medium text-teal-800 mb-6">
              購物車Store中的加購商品 ({addOns.length} 個)
              {isLoadingAddOns && <span className="text-sm text-gray-500 ml-2">(載入中...)</span>}
            </h2>
            
            {isLoadingAddOns ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <p className="text-gray-500 mt-2">載入中...</p>
              </div>
            ) : addOns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">暫無資料</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {addOns.map((item) => (
                  <AddOnItem 
                    key={item.productId} 
                    item={item}
                    onAddToCart={() => console.log('加入購物車:', item.name)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* API 資訊 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="text-2xl font-medium text-teal-800 mb-6">API 資訊</h2>
            <div className="space-y-2 text-sm">
              <p><strong>API 端點：</strong> /api/homepage?sectionName=popularProducts</p>
              <p><strong>預期回應格式：</strong></p>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
{`{
  "status": true,
  "data": {
    "books": [
      {
        "id": 505,
        "title": "My Animal Friends",
        "imageUrl": "https://example.com/covers/animal_friends.jpg",
        "price": 300
      },
      // ... more books
    ]
  }
}`}
              </pre>
              <p><strong>注意：</strong> API回應會自動轉換為加購商品格式，加購價格為原價的50%</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
} 