"use client";

import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/interaction/FloatingButtons";
import ClientChat from "@/components/interaction/chat/ClientChat";
import ProductBanner from "@/components/products/list/ProductBanner";
import FilterSidebar from "@/components/products/list/FilterSidebar";
import ProductList from "@/components/products/list/ProductList";
import CategoryFilter from "@/components/products/list/CategoryFilter";
import { useSearchParams } from "next/navigation";
import { useProductSearchStore } from "@/lib/store/useProductSearchStore";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const { 
    products, 
    pagination, 
    isLoading, 
    error, 
    initFromQuery, 
    fetchProducts 
  } = useProductSearchStore();

  // 從 URL 參數初始化並觸發查詢
  useEffect(() => {
    initFromQuery(searchParams);
  }, [searchParams, initFromQuery]);

  // 初始載入
  useEffect(() => {
    // 如果沒有 URL 參數，載入預設商品
    if (!searchParams.get("keyword") && !searchParams.get("category_id") && !searchParams.get("age_range_id")) {
      fetchProducts();
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-8 px-16 sm:pt-16 lg:pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Banner */}
          <ProductBanner />
          
          {/* 分類篩選 */}
          <CategoryFilter />
          
          {/* 主要內容區域 */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 左側篩選欄 */}
            <FilterSidebar />
            
            {/* 右側商品列表 */}
            <div className="flex-1">
              {isLoading && (
                <div className="flex justify-center items-center py-20">
                  <div className="text-lg text-gray-600">載入中...</div>
                </div>
              )}
              
              {error && (
                <div className="flex justify-center items-center py-20">
                  <div className="text-lg text-red-600">{error}</div>
                </div>
              )}
              
              {!isLoading && !error && (
                <ProductList />
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <FloatingButtons />
      <ClientChat />
    </div>
  );
}
