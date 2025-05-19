"use client";

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CategoryFilter from "@/components/products/list/CategoryFilter"
import ProductGrid from "@/components/products/list/ProductGrid"
import { categories, products } from "@/lib/data/products"
import { useState } from "react"
import FloatingButtons from "@/components/interaction/FloatingButtons";
import ClientChat from "@/components/interaction/chat/ClientChat";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("全部作品")
  
  // 模擬根據分類過濾商品 (實際專案中會從 API 獲取)
  const filteredProducts = activeCategory === "全部作品"
    ? products
    : products.filter((_, index) => index % 2 === 0) // 假過濾，僅供示範

  return (
    <main className="min-h-screen bg-orange-50">
      <Header />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32 md:pt-28">
        {/* 頁面標題 */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 font-jf-openhuninn mb-4">探索故事世界</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            每一本書都是一次奇幻冒險，陪伴孩子成長，啟發無限想像力
          </p>
        </div>

        {/* 分類過濾器 */}
        <CategoryFilter 
          categories={categories} 
          onCategoryChange={setActiveCategory} 
        />

        {/* 商品網格 */}
        <ProductGrid products={filteredProducts} />
      </section>

      {/* 浮動回到頂部按鈕 */}
      <FloatingButtons />
      
      {/* 聊天機器人 */}
      <ClientChat />

      <Footer />
    </main>
  )
}
