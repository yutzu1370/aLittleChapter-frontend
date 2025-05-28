"use client";

import { useEffect, useState } from "react";
import { fetchProductById, fetchRelatedProducts, fetchProductReviews } from "@/lib/api/products";
import ProductImages from "@/components/products/detail/ProductImages";
import ProductInfo from "@/components/products/detail/ProductInfo";
import ProductAbout from "@/components/products/detail/ProductAbout";
import RelatedProducts from "@/components/products/detail/RelatedProducts";
import ProductReviews from "@/components/products/detail/ProductReviews";
import FloatingButtons from "@/components/interaction/FloatingButtons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ClientChat from "@/components/interaction/chat/ClientChat";
import { useParams } from "next/navigation";
import { ProductDetail, Product, Review, ProductResponse } from "@/lib/types/product";

export default function ProductDetailPage() {
  // 使用 useParams 鉤子獲取路由參數
  const params = useParams();
  const id = params.id as string;
  
  // 使用狀態管理商品資料
  const [productResponse, setProductResponse] = useState<ProductResponse | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 當 ID 變化時獲取數據
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 使用Mock API獲取商品詳情
        const response = await fetchProductById(id);
        setProductResponse(response);
        
        // 獲取相關商品
        const relatedData = await fetchRelatedProducts(id);
        setRelatedProducts(relatedData);
        
        // 獲取評論
        const reviewsData = await fetchProductReviews(id);
        setReviews(reviewsData);
      } catch (err) {
        console.error("獲取商品資料失敗:", err);
        setError("無法載入商品資料，請稍後再試。");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchData();
    }
  }, [id]);
  
  // 載入中狀態
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-gray-600">載入中...</div>
      </main>
    );
  }
  
  // 錯誤處理
  if (error || !productResponse || !productResponse.status) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-gray-600">{error || "找不到商品資料"}</div>
      </main>
    );
  }

  // 提取商品數據
  const product = productResponse.data;

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* 主要內容區域 - 增加頂部 padding 避免被導航列遮擋 */}
      <section className="w-full py-12 pt-56 md:pt-40 px-4 sm:px-6 lg:px-8 xl:px-0 max-w-7xl mx-auto bg-white">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 商品圖片區 - 使用組件 */}
          <ProductImages 
            images={product.imageUrls} 
            productName={product.title} 
          />

          {/* 商品資訊區 - 使用組件，需要調整組件接口以匹配新格式 */}
          <ProductInfo 
            product={{
              id: product.productId.toString(),
              name: product.title,
              description: product.description,
              price: product.price,
              originalPrice: product.discountPrice || product.price,
              author: { 
                name: product.author,
                description: ''
              },
              images: product.imageUrls,
              image: product.imageUrls[0],
              promotionEnd: '',
              translator: { name: '', description: '' },
              illustrator: { name: product.illustrator, description: '' },
              aboutContent: product.introductionHtml,
              authorName: product.author,
              publisherName: product.publisher
            }}
            category={product.categoryInfo.name}
            ageRange={product.ageRange.name}
          />
        </div>
      </section>

      {/* 內容簡介區塊 */}
      <ProductAbout aboutContent={product.introductionHtml} />

      {/* 探索更多故事區塊 */}
      <RelatedProducts products={relatedProducts} />

      {/* 會員評價區塊 */}
      <ProductReviews reviews={reviews} />

      {/* 浮動回到頂部按鈕 */}
      <FloatingButtons />
      
      {/* 聊天機器人 */}
      <ClientChat />

      <Footer />
    </main>
  );
}
