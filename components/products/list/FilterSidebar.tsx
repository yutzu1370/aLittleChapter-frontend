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
  
  // 控制各分類的展開/收合狀態
  const [expandedSections, setExpandedSections] = useState({
    age: true,
    theme: true,
    price: true,
    publisher: false
  });
  
  // 切換分類的展開/收合狀態
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
        <div 
          onClick={() => toggleSection('age')}
          className="flex justify-between items-center mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <h3 className="text-xl font-jf-openhuninn text-gray-900">年齡分類</h3>
          <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Image 
              src={expandedSections.age ? "/images/icon/remove-rounded.svg" : "/images/icon/add-rounded-2.svg"} 
              alt={expandedSections.age ? "收合" : "展開"} 
              width={24} 
              height={24} 
            />
          </div>
        </div>
        {expandedSections.age && (
          <div className="flex flex-col gap-2">
            {ageFilters.map((filter) => (
              <div key={filter} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id={`age-${filter}`} 
                  checked={activeAgeFilters.includes(filter)}
                  onChange={() => onToggleAgeFilter(filter)}
                  className={`w-4 h-4 form-checkbox rounded ${
                    activeAgeFilters.includes(filter)
                      ? 'bg-orange-600 border-orange-600 text-white accent-orange-600' 
                      : 'border border-gray-300'
                  } focus:ring-orange-500 focus:ring-offset-0`}
                />
                <label htmlFor={`age-${filter}`} className="text-gray-900 cursor-pointer flex-1">{filter}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="w-full h-px bg-gray-200 my-6"></div>
      
      {/* 主題分類 */}
      <div className="mb-6">
        <div 
          onClick={() => toggleSection('theme')}
          className="flex justify-between items-center mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <h3 className="text-xl font-jf-openhuninn text-gray-900">主題分類</h3>
          <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Image 
              src={expandedSections.theme ? "/images/icon/remove-rounded-2.svg" : "/images/icon/add-rounded-2.svg"} 
              alt={expandedSections.theme ? "收合" : "展開"} 
              width={24} 
              height={24} 
            />
          </div>
        </div>
        {expandedSections.theme && (
          <div className="flex flex-col gap-2">
            {themeFilters.map((filter) => (
              <div key={filter} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id={`theme-${filter}`} 
                  checked={activeThemeFilters.includes(filter)}
                  onChange={() => onToggleThemeFilter(filter)}
                  className={`w-4 h-4 form-checkbox rounded ${
                    activeThemeFilters.includes(filter) 
                      ? 'bg-orange-600 border-orange-600 text-white accent-orange-600' 
                      : 'border border-gray-300'
                  } focus:ring-orange-500 focus:ring-offset-0`}
                />
                <label htmlFor={`theme-${filter}`} className="text-gray-900 cursor-pointer flex-1">{filter}</label>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="w-full h-px bg-gray-200 my-6"></div>
      
      {/* 價格範圍 */}
      <div className="mb-6">
        <div 
          onClick={() => toggleSection('price')}
          className="flex justify-between items-center mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <h3 className="text-xl font-jf-openhuninn text-gray-900">價格範圍</h3>
          <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Image 
              src={expandedSections.price ? "/images/icon/remove-rounded-2.svg" : "/images/icon/add-rounded-2.svg"} 
              alt={expandedSections.price ? "收合" : "展開"} 
              width={24} 
              height={24} 
            />
          </div>
        </div>
        {expandedSections.price && (
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
        )}
      </div>
      
      <div className="w-full h-px bg-gray-200 my-6"></div>
      
      {/* 出版社/作者 */}
      <div>
        <div 
          onClick={() => toggleSection('publisher')}
          className="flex justify-between items-center mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
        >
          <h3 className="text-xl font-jf-openhuninn text-gray-900">出版社/作者</h3>
          <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
            <Image 
              src={expandedSections.publisher ? "/images/icon/remove-rounded-2.svg" : "/images/icon/add-rounded-2.svg"} 
              alt={expandedSections.publisher ? "收合" : "展開"} 
              width={24} 
              height={24} 
            />
          </div>
        </div>
        {expandedSections.publisher && (
          <div className="flex flex-col gap-2">
            <p className="text-gray-500">出版社/作者篩選功能尚未實作</p>
          </div>
        )}
      </div>
    </div>
  );
} 