"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useProductSearchStore } from "@/lib/store/useProductSearchStore";

export default function FilterSidebar() {
  const {
    activeAgeFilters,
    activeThemeFilters,
    activePriceFilter,
    authorKeyword,
    publisherKeyword,
    clearFilters,
    toggleAgeFilter,
    toggleThemeFilter,
    setPriceFilter,
    setAuthorKeyword,
    setPublisherKeyword
  } = useProductSearchStore();
  const ageFilters = ["0-3 歲", "3-5 歲", "5-7 歲", "7-11 歲", "11-13 歲"];
  const themeFilters = ["健康生活", "科學知識", "藝術啟蒙", "音樂欣賞", "勵志成長"];
  const priceFilters = ["$", "$$", "$$$"];
  
  // 本地狀態用於輸入框
  const [authorInput, setAuthorInput] = useState("");
  const [publisherInput, setPublisherInput] = useState("");
  
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

  // debounce for author
  const authorDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const handleAuthorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAuthorInput(value);
    if (authorDebounceRef.current) clearTimeout(authorDebounceRef.current);
    authorDebounceRef.current = setTimeout(() => {
      setAuthorKeyword(value);
    }, 1000);
  };

  // debounce for publisher
  const publisherDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const handlePublisherInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPublisherInput(value);
    if (publisherDebounceRef.current) clearTimeout(publisherDebounceRef.current);
    publisherDebounceRef.current = setTimeout(() => {
      setPublisherKeyword(value);
    }, 1000);
  };

  // 清除所有篩選包括本地狀態
  const handleClearFilters = () => {
    setAuthorInput("");
    setPublisherInput("");
    clearFilters();
  };

  return (
    <div className="w-full lg:w-64 bg-white rounded-3xl border border-gray-200 p-6 h-fit">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-jf-openhuninn text-gray-900">篩選</h2>
        <button 
          onClick={handleClearFilters} 
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
                  onChange={() => toggleAgeFilter(filter)}
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
                  onChange={() => toggleThemeFilter(filter)}
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
                onClick={() => setPriceFilter(price)}
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
          <h3 className="text-xl font-jf-openhuninn text-gray-900">作者/出版社</h3>
          <div className="w-8 h-8 flex items-center justify-center rounded-full hover:border-orange-100">
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
            <input
              type="text"
              placeholder="請輸入作者名稱"
              value={authorInput}
              onChange={handleAuthorInput}
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200"
            />
            <input
              type="text"
              placeholder="請輸入出版社名稱"
              value={publisherInput}
              onChange={handlePublisherInput}
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 transition-all duration-200"
            />
          </div>
        )}
      </div>
    </div>
  );
} 