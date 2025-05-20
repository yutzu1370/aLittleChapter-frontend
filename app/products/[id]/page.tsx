"use client";

import { useEffect, useState } from "react";
import { getProductById, getRelatedProducts, reviews } from "@/lib/data/products";
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
import { ProductDetail, Product } from "@/lib/types/product";

export default function ProductDetailPage() {
  // 使用 useParams 鉤子獲取路由參數
  const params = useParams();
  const id = params.id as string;
  
  // 使用狀態管理商品資料
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 當 ID 變化時獲取數據
  useEffect(() => {
    if (id) {
      // 獲取商品詳情
      const productData = getProductById(id);
      setProduct(productData);
      
      // 獲取相關商品
      const relatedData = getRelatedProducts(id);
      setRelatedProducts(relatedData);
      
      setIsLoading(false);
    }
  }, [id]);
  
  // 載入中狀態
  if (isLoading || !product) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-gray-600">載入中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* 主要內容區域 - 增加頂部 padding 避免被導航列遮擋 */}
      <section className="w-full py-12 pt-56 md:pt-40 px-4 sm:px-6 lg:px-8 xl:px-0 max-w-7xl mx-auto bg-white">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 商品圖片區 - 使用組件 */}
          <ProductImages images={product.images} productName={product.name} />

          {/* 商品資訊區 - 使用組件 */}
          <ProductInfo product={product} />
        </div>
      </section>

      {/* 內容簡介區塊 */}
      <ProductAbout aboutContent={product.aboutContent} />

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
