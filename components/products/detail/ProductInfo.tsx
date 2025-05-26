"use client";

import { useState } from "react";
import { ProductDetail } from "@/lib/types/product";
import { toast } from "sonner";

interface ProductInfoProps {
  product: ProductDetail;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("author");

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      toast.success("連結已複製", {
        description: "產品連結已複製到剪貼簿",
        duration: 3000,
      });
    }).catch(err => {
      toast.error("複製失敗", {
        description: "無法複製連結，請重試",
        duration: 3000,
      });
      console.error("無法複製連結:", err);
    });
  };

  return (
    <div className="w-full md:w-[984px] flex-1 pl-8">
      {/* 標題與收藏分享按鈕 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 font-jf-openhuninn">
          {product.name}
        </h1>
        <div className="flex gap-2">
          <button className="p-3 rounded-full border-2 border-orange-500 bg-white shadow-md hover:bg-orange-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button 
            className="p-3 rounded-full border-2 border-orange-500 bg-white shadow-md hover:bg-orange-50"
            onClick={handleShare}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 商品描述 */}
      <p className="text-gray-700 text-lg mb-6">
        {product.description}
      </p>

      {/* 分隔線 */}
      <div className="w-full h-px bg-gray-300 my-6"></div>

      {/* 價格區塊 */}
      <div className="mb-6">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-2xl font-bold text-orange-500">NT$ {product.price}</span>
          <span className="text-gray-500 line-through">原價 NT$ {product.originalPrice}</span>
        </div>
        <p className="text-red-800 text-sm">優惠期限：{product.promotionEnd}</p>
      </div>

      {/* 數量選擇和加入購物車 */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="flex items-center h-12 border-4 border-[#F8D0B0] rounded-full overflow-hidden w-[250px]">
          <button 
            onClick={decreaseQuantity}
            className="bg-white h-full w-12 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <div className="flex-1 h-full flex items-center justify-center font-bold">
            {quantity}
          </div>
          <button 
            onClick={increaseQuantity}
            className="bg-white h-full w-12 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <button 
          className="w-[250px] bg-orange-500 text-white rounded-full px-8 py-3 font-semibold flex items-center justify-center gap-2 shadow-[2px_3px_0px_0px_rgba(116,40,26,1)] hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(116,40,26,1)] transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          加入購物車
        </button>
      </div>

      {/* 標籤選項 */}
      <div className="mt-8">
        <div className="flex gap-2">
          <button 
            className={`px-8 py-3 rounded-t-2xl text-lg font-medium ${activeTab === 'author' ? 'bg-white border-4 border-b-0 border-[#F8D0B0] text-amber-900' : 'bg-[#FCE9D8] text-gray-600'}`}
            onClick={() => setActiveTab('author')}
          >
            作者
          </button>
          <button 
            className={`px-8 py-3 rounded-t-2xl text-lg font-medium ${activeTab === 'publisher' ? 'bg-white border-4 border-b-0 border-[#F8D0B0] text-amber-900' : 'bg-[#FCE9D8] text-gray-600'}`}
            onClick={() => setActiveTab('publisher')}
          >
            出版
          </button>
          <button 
            className={`px-8 py-3 rounded-t-2xl text-lg font-medium ${activeTab === 'specs' ? 'bg-white border-4 border-b-0 border-[#F8D0B0] text-amber-900' : 'bg-[#FCE9D8] text-gray-600'}`}
            onClick={() => setActiveTab('specs')}
          >
            規格
          </button>
        </div>
        <div className="bg-white p-8 rounded-b-2xl rounded-tr-2xl border-4 border-[#F8D0B0]">
          {activeTab === 'author' && (
            <div className="space-y-4">
              <p className="text-gray-800">
                <strong>作者：{product.author.name}</strong><br />
                善於觀察小動物與大自然，擅長用溫暖筆觸編織勇氣與成長的小故事。
              </p>
              <p className="text-gray-800">
                <strong>譯者：{product.translator.name}</strong><br />
                擁有豐富中英雙語翻譯經驗，致力於讓每個故事都能跨越語言，觸動孩子的心靈。
              </p>
              <p className="text-gray-800">
                <strong>繪者：{product.illustrator.name}</strong><br />
                專攻粉蠟筆插畫，擅長打造溫柔夢幻的森林世界，讓每個故事都像童話般展開。
              </p>
            </div>
          )}
          {activeTab === 'publisher' && (
            <div>
              <p className="text-gray-800">出版資訊將顯示在這裡</p>
            </div>
          )}
          {activeTab === 'specs' && (
            <div>
              <p className="text-gray-800">商品規格將顯示在這裡</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 