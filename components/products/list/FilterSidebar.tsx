"use client";

import { useState } from "react";
import Image from "next/image";

interface FilterSidebarProps {
  activeAgeFilters: string[];
  activeThemeFilters: string[];
  activePriceFilter: string | null;
  onClearFilters: () => void;
  onToggleAgeFilter: (filter: string) => void;
  onToggleThemeFilter: (filter: string) => void;
  onSetPriceFilter: (price: string) => void;
}

export default function FilterSidebar({
  activeAgeFilters,
  activeThemeFilters,
  activePriceFilter,
  onClearFilters,
  onToggleAgeFilter,
  onToggleThemeFilter,
  onSetPriceFilter
}: FilterSidebarProps) {
  const ageFilters = ["0-3 歲", "3-5 歲", "5-7 歲", "7-11 歲", "11-13 歲"];
  const themeFilters = ["親子共讀", "健康飲食", "科學啟蒙", "兒童文學", "藝術啟蒙"];
  const priceFilters = ["$", "$$", "$$$"];

  return (
    <div className="w-full lg:w-80 bg-white rounded-3xl border border-gray-200 p-6 h-fit">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-jf-openhuninn text-gray-900">篩選</h2>
        <button 
          onClick={onClearFilters} 
          className="text-orange-600 hover:underline"
        >
          清除篩選
        </button>
      </div>
      
      {/* 年齡分類 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-jf-openhuninn text-gray-900">年齡分類</h3>
          <button>
            <Image src="/images/icon/remove-rounded.svg" alt="收合" width={24} height={24} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {ageFilters.map((filter) => (
            <div key={filter} className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id={`age-${filter}`} 
                checked={activeAgeFilters.includes(filter)}
                onChange={() => onToggleAgeFilter(filter)}
                className="w-4 h-4 border border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor={`age-${filter}`} className="text-gray-900">{filter}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-full h-px bg-gray-200 my-6"></div>
      
      {/* 主題分類 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-jf-openhuninn text-gray-900">主題分類</h3>
          <button>
            <Image src="/images/icon/remove-rounded-2.svg" alt="收合" width={24} height={24} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {themeFilters.map((filter) => (
            <div key={filter} className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id={`theme-${filter}`} 
                checked={activeThemeFilters.includes(filter)}
                onChange={() => onToggleThemeFilter(filter)}
                className={`w-4 h-4 rounded ${
                  activeThemeFilters.includes(filter) 
                    ? 'bg-orange-600 border-orange-600' 
                    : 'border border-gray-300'
                } focus:ring-orange-500`}
              />
              <label htmlFor={`theme-${filter}`} className="text-gray-900">{filter}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-full h-px bg-gray-200 my-6"></div>
      
      {/* 價格範圍 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-jf-openhuninn text-gray-900">價格範圍</h3>
        </div>
        <div className="flex gap-2">
          {priceFilters.map((price) => (
            <button
              key={price}
              onClick={() => onSetPriceFilter(price)}
              className={`w-16 h-10 rounded-full flex items-center justify-center ${
                activePriceFilter === price ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-900'
              }`}
            >
              {price}
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-full h-px bg-gray-200 my-6"></div>
      
      {/* 出版社/作者 */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-jf-openhuninn text-gray-900">出版社/作者</h3>
          <button>
            <Image src="/images/icon/add-rounded-2.svg" alt="展開" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  );
} 