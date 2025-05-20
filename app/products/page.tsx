"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { categories, products } from "@/lib/data/products";
import FloatingButtons from "@/components/interaction/FloatingButtons";
import ClientChat from "@/components/interaction/chat/ClientChat";
import ProductBanner from "@/components/products/list/ProductBanner";
import FilterSidebar from "@/components/products/list/FilterSidebar";
import ProductList from "@/components/products/list/ProductList";

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("全部作品");
  const [activeAgeFilters, setActiveAgeFilters] = useState<string[]>([]);
  const [activeThemeFilters, setActiveThemeFilters] = useState<string[]>(["親子共讀"]);
  const [activePriceFilter, setActivePriceFilter] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 模擬根據分類過濾商品
  const filteredProducts = activeCategory === "全部作品"
    ? products
    : products.filter((_, index) => index % 2 === 0); // 假過濾，僅供示範

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? 4 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev === 4 ? 0 : prev + 1));
  };

  const handleClearFilters = () => {
    setActiveAgeFilters([]);
    setActiveThemeFilters([]);
    setActivePriceFilter(null);
  };

  const toggleAgeFilter = (filter: string) => {
    setActiveAgeFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  const toggleThemeFilter = (filter: string) => {
    setActiveThemeFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  const setPriceFilter = (price: string) => {
    setActivePriceFilter(prev => prev === price ? null : price);
  };

  return (
    <main className="min-h-screen bg-orange-50">
      <Header />
      
      {/* 輪播橫幅區域 */}
      <ProductBanner 
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        onPrevSlide={handlePrevSlide}
        onNextSlide={handleNextSlide}
      />
      
      {/* 商品區塊 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 篩選側邊欄 */}
          <FilterSidebar 
            activeAgeFilters={activeAgeFilters}
            activeThemeFilters={activeThemeFilters}
            activePriceFilter={activePriceFilter}
            onClearFilters={handleClearFilters}
            onToggleAgeFilter={toggleAgeFilter}
            onToggleThemeFilter={toggleThemeFilter}
            onSetPriceFilter={setPriceFilter}
          />
          
          {/* 產品列表 */}
          <ProductList 
            products={filteredProducts}
            searchKeyword="親子共讀"
            totalCount={15}
          />
        </div>
      </section>

      {/* 浮動回到頂部按鈕 */}
      <FloatingButtons />
      
      {/* 聊天機器人 */}
      <ClientChat />

      <Footer />
    </main>
  );
}
