"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const [showAll, setShowAll] = useState(false);
  
  // 根據畫面寬度決定顯示多少個類別
  const visibleCategories = showAll ? categories : categories.slice(0, 5);
  
  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200 p-6 mb-6">
      <div className="flex flex-wrap gap-3">
        {visibleCategories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
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
        
        {categories.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {showAll ? "收起" : "更多..."}
          </button>
        )}
      </div>
    </div>
  );
} 