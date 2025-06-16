"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useProductSearchStore } from "@/lib/store/useProductSearchStore";

export default function CategoryFilter() {
  const { activeCategory, setActiveCategory } = useProductSearchStore();
  
  const categories = ["全部作品", "亮點新書", "熱銷排行", "優惠折扣", "科學知識", "藝術啟蒙", "音樂欣賞", "勵志成長"];
  const [showAll, setShowAll] = useState(false);

  // 監聽 activeCategory 變化，確保組件狀態同步
  useEffect(() => {
    // 當 activeCategory 重置為 '全部作品' 時，確保 showAll 狀態也重置
    if (activeCategory === '全部作品') {
      setShowAll(false);
    }
  }, [activeCategory]);
  
  // 根據畫面寬度決定顯示多少個類別
  const visibleCategories = showAll ? categories : categories.slice(0, 4);
  
  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200 p-6 mb-6">
      <div className="flex flex-wrap gap-3">
        {visibleCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              activeCategory === category
                ? "bg-orange-100 text-orange-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {category}
          </button>
        ))}
        
      </div>
    </div>
  );
} 