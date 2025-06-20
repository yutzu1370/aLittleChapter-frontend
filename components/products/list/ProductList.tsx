"use client";

import Image from "next/image";
import { Product } from "@/lib/types/product";
import ProductCard from "./ProductCard";
import { useProductSearchStore } from "@/lib/store/useProductSearchStore";

interface ProductListProps {
  searchKeyword?: string;
  totalCount?: number;
}

export default function ProductList({ searchKeyword = "親子共讀", totalCount = 15 }: ProductListProps) {
  const { products, pagination, currentPage, setCurrentPage, isLoading } = useProductSearchStore();
  
  const totalPages = pagination?.totalPages || 1;
  
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
        pageNumbers.push(currentPage);
      }
      if (currentPage < totalPages) {
        pageNumbers.push('...');
      }
      if (totalPages > 5) {
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };
  
  return (
    <div className="flex-1 mb-10">
      
      {/* 載入狀態 */}
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500"></div>
        </div>
      )}
      
      {/* 無商品提示 */}
      {!isLoading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">

          <h3 className="text-xl font-jf-openhuninn text-gray-600 mb-2">找不到相關商品</h3>
          <p className="text-gray-500 mb-4">請嘗試調整搜尋條件或篩選設定</p>

        </div>
      )}
      
      {/* 商品網格 */}
      {!isLoading && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* 分頁 */}
          <div className="flex justify-center sm:justify-end items-center mt-6 sm:mt-8 gap-2 sm:gap-4">
            <button 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50 touch-manipulation"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <Image src="/images/icon/chevron-left.svg" alt="上一頁" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide max-w-[200px] sm:max-w-none">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="mx-1 text-gray-500 text-sm sm:text-base">...</span>
                ) : (
                  <button 
                    key={`page-${page}`} 
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-jf-openhuninn text-sm sm:text-base touch-manipulation ${
                      page === currentPage ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    onClick={() => setCurrentPage(Number(page))}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>
            
            <button 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50 touch-manipulation"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Image src="/images/icon/chevron-right.svg" alt="下一頁" width={20} height={20} className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </>
      )}
    </div>  
  );
} 