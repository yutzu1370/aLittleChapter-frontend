"use client";

import { useState, useEffect } from "react";
import { ProductDetail, Product } from "@/lib/types/product";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useCartStore } from "@/lib/store/useCartStore";
import { useFavoritesStore } from "@/lib/store/useFavoritesStore";
import { Heart } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

interface ProductInfoProps {
  product: ProductDetail;
  category?: string;
  ageRange?: string;
}

export default function ProductInfo({ product, category, ageRange }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("author");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  
  const productId = product.productId;
  const isFavoriteProduct = isFavorite(productId);

  const increaseQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(prev => prev + 1);
    } else {
      toast.warning("庫存不足", {
        description: `目前庫存僅剩 ${product.stockQuantity} 件`,
        duration: 3000,
      });
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    if (value > product.stockQuantity) {
      toast.warning("庫存不足", {
        description: `目前庫存僅剩 ${product.stockQuantity} 件`,
        duration: 3000,
      });
      setQuantity(product.stockQuantity);
    } else if (value < 1) {
      setQuantity(1);
    } else {
      setQuantity(value);
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

  const handleAddToCart = async () => {
    if (product.stockQuantity === 0) {
      toast.error("商品缺貨", {
        description: "此商品目前缺貨中",
        duration: 3000,
      });
      return;
    }
    
    setIsAddingToCart(true);
    
    try {
      // 將 ProductDetail 轉換為 Product 類型以符合 addItem 的要求
      const productForCart: Product = {
        id: product.productId.toString(),
        name: product.name,
        description: product.aboutContent || '',
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0] || '',
        stockQuantity: product.stockQuantity,
        authorName: product.author,
        publisherName: product.publisher,
      };
      
      // 訪客使用者：使用 Zustand store（會自動持久化到 localStorage）
      addItem(productForCart, quantity);
      
      toast.success("已加入購物車", {
        description: `${product.name} x ${quantity} 已加入購物車`,
        duration: 3000,
      });
      
      // 重置數量為 1
      setQuantity(1);
      
    } catch (error) {
      console.error("加入購物車失敗:", error);
      toast.error("加入購物車失敗", {
        description: "請稍後再試",
        duration: 3000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = () => {
    const newFavoriteState = toggleFavorite(productId);
    
    if (!isAuthenticated) {
      // 訪客使用者：顯示登入提示
      toast.success(newFavoriteState ? "已加入收藏" : "已從收藏移除", {
        description: "登入後可永久保存收藏",
        duration: 4000,
      });
      return;
    }

    // TODO: 已登入使用者的收藏功能 - 同步到後端
    toast.success(newFavoriteState ? "已加入收藏" : "已從收藏移除", {
      duration: 3000,
    });
  };

  return (
    <div className="w-full md:w-[984px] flex-1 pl-8">
      {/* 標題與收藏分享按鈕 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 font-jf-openhuninn">
            {product.name}
          </h1>
          {/* Category and Age Range Tags */}
          {(category || ageRange) && (
            <div className="flex gap-2">
              {category && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#F3FAF8] text-[#295C58] ">
                  {category}
                </span>
              )}
              {ageRange && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#FEF5EE] text-[#B4371A]">
                  {ageRange}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2 ml-4">
          <button 
            className={`p-3 rounded-full border-2 bg-white shadow-md transition-all ${
              isFavoriteProduct 
                ? 'border-red-500 bg-red-50 hover:bg-red-100' 
                : 'border-orange-500 hover:bg-orange-50'
            }`}
            onClick={handleToggleFavorite}
            aria-label={isFavoriteProduct ? "從收藏移除" : "加入收藏"}
          >
            <Heart 
              className={`h-6 w-6 ${
                isFavoriteProduct 
                  ? 'text-red-500 fill-current' 
                  : 'text-orange-500'
              }`} 
            />
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

      {/* 分隔線 */}
      <div className="w-full h-px bg-gray-300 my-6"></div>

      {/* 價格區塊 */}
      <div className="mb-6">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-2xl font-bold text-orange-500">NT$ {product.price}</span>
          {product.discountPrice && (
            <span className="text-gray-500 line-through">原價 NT$ {product.originalPrice}</span>
          )}
        </div>
        {/* 庫存資訊 */}
        <div className="text-sm text-gray-600 mt-2">
          {product.stockQuantity > 0 ? (
            <span className="text-[#B4371A]">庫存：{product.stockQuantity} 件</span>
          ) : (
            <span className="text-red-600">目前缺貨</span>
          )}
        </div>
      </div>

      {/* 數量選擇和加入購物車 */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="flex items-center h-12 border-4 border-[#F8D0B0] rounded-full overflow-hidden w-[250px]">
          <button 
            onClick={decreaseQuantity}
            className="bg-white h-full w-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
            disabled={quantity <= 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            min="1"
            max={product.stockQuantity}
            value={quantity}
            onChange={handleQuantityChange}
            className="flex-1 h-full text-center font-bold bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button 
            onClick={increaseQuantity}
            className="bg-white h-full w-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
            disabled={quantity >= product.stockQuantity}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <button 
          className={`w-[250px] text-white rounded-full px-8 py-3 font-semibold flex items-center justify-center gap-2 transition-all ${
            product.stockQuantity === 0 || isAddingToCart
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-500 shadow-[2px_3px_0px_0px_rgba(116,40,26,1)] hover:translate-y-1 hover:shadow-[1px_1px_0px_0px_rgba(116,40,26,1)]'
          }`}
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0 || isAddingToCart}
        >
          {isAddingToCart ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              加入中...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {product.stockQuantity === 0 ? '缺貨中' : '加入購物車'}
            </>
          )}
        </button>
      </div>

      {/* 標籤選項 */}
      <div className="mt-8">
        <div className="flex gap-2 relative">
          <button 
            className={`px-8 py-3 rounded-t-2xl text-lg font-medium relative ${activeTab === 'author' ? 'bg-white border-4 border-b-0 border-[#F8D0B0] text-amber-900 z-10' : 'bg-[#FCE9D8] text-gray-600'}`}
            onClick={() => setActiveTab('author')}
          >
            作者
          </button>
          <button 
            className={`px-8 py-3 rounded-t-2xl text-lg font-medium relative ${activeTab === 'publisher' ? 'bg-white border-4 border-b-0 border-[#F8D0B0] text-amber-900 z-10' : 'bg-[#FCE9D8] text-gray-600'}`}
            onClick={() => setActiveTab('publisher')}
          >
            出版
          </button>
          <button 
            className={`px-8 py-3 rounded-t-2xl text-lg font-medium relative ${activeTab === 'specs' ? 'bg-white border-4 border-b-0 border-[#F8D0B0] text-amber-900 z-10' : 'bg-[#FCE9D8] text-gray-600'}`}
            onClick={() => setActiveTab('specs')}
          >
            規格
          </button>
        </div>
        <div className="bg-white p-8 rounded-b-2xl rounded-tr-2xl border-4 border-[#F8D0B0] relative -mt-1">
          {activeTab === 'author' && (
            <div className="space-y-4">
              <p className="text-gray-800">
                <strong>作者：{product.author}</strong><br />
                善於觀察小動物與大自然，擅長用溫暖筆觸編織勇氣與成長的小故事。
              </p>
              <p className="text-gray-800">
                <strong>繪者：{product.illustrator}</strong><br />
                專攻粉蠟筆插畫，擅長打造溫柔夢幻的森林世界，讓每個故事都像童話般展開。
              </p>
            </div>
          )}
          {activeTab === 'publisher' && (
            <div className="space-y-4">
              <p className="text-gray-800">
                <strong>出版社：{product.publisher}</strong><br />
              </p>
              <p className="text-gray-800">
                <strong>出版日期：{product.publishDate}</strong><br />
              </p>
            </div>
          )}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <p className="text-gray-800">
                <strong>ISBN：{product.isbn}</strong><br />
              </p>
              <p className="text-gray-800">
                <strong>頁數：{product.pageCount}</strong><br />
              </p>
              <p className="text-gray-800">
                <strong>商品編號：{product.productId}</strong><br />
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />
    </div>
  );
} 