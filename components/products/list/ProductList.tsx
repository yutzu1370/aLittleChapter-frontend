"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types/product";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Product[];
  searchKeyword?: string;
  totalCount?: number;
}

export default function ProductList({ products, searchKeyword = "親子共讀", totalCount = 15 }: ProductListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // 假設總頁數為10
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 生成顯示的頁碼
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // 永遠顯示前五頁
    for (let i = 1; i <= Math.min(5, totalPages); i++) {
      pageNumbers.push(i);
    }
    
    // 如果總頁數大於5，顯示省略號
    if (totalPages > 5) {
      if (currentPage > 5) {
        pageNumbers.push('...');
        // 顯示當前頁（如果當前頁大於5）
        pageNumbers.push(currentPage);
      }
      
      // 如果當前頁不是最後一頁，顯示省略號
      if (currentPage < totalPages) {
        pageNumbers.push('...');
      }
      
      // 顯示最後一頁（如果不是前5頁中的一頁）
      if (totalPages > 5) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  return (
    <div className="flex-1">
      
      {/* 商品網格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* 分頁 */}
      <div className="flex justify-end items-center mt-8 gap-4">
        <button 
          className="w-3 h-3 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Image src="/images/icon/chevron-left.svg" alt="上一頁" width={20} height={20} />
        </button>
        
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="mx-1 text-gray-500">...</span>
          ) : (
            <button 
              key={`page-${page}`} 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-jf-openhuninn ${
                page === currentPage ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => handlePageChange(Number(page))}
            >
              {page}
            </button>
          )
        ))}
        
        <button 
          className="w-3 h-3 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Image src="/images/icon/chevron-right.svg" alt="下一頁" width={20} height={20} />
        </button>
      </div>
    </div>  
  );
} 