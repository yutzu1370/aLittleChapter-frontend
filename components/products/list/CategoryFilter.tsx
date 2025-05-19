"use client";

import { useState } from "react";

interface CategoryFilterProps {
  categories: string[];
  onCategoryChange?: (category: string) => void;
}

export default function CategoryFilter({ categories, onCategoryChange }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0] || "全部作品");

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-200 ${
            activeCategory === category
              ? 'bg-orange-500 text-white shadow-[4px_6px_0px_0px_rgba(116,40,26,1)]'
              : 'bg-white text-gray-800 border border-gray-300 hover:bg-orange-100'
          }`}
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
} 