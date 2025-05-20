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
  
  return (
    <div className="flex-1">
      <h2 className="text-lg text-gray-500 mb-6">
        {searchKeyword && `搜尋「${searchKeyword}」的結果，共 ${totalCount} 項商品`}
      </h2>
      
      {/* 商品網格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* 分頁 */}
      <div className="flex justify-end items-center mt-8">
        <button className="w-10 h-10 rounded-full flex items-center justify-center">
          <Image src="/images/icon/chevron-left.svg" alt="上一頁" width={20} height={20} />
        </button>
        {[1, 2, 3, 4, 5].map(page => (
          <button 
            key={page} 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-jf-openhuninn ${
              page === currentPage ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-100'
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <span className="mx-1">...</span>
        <button className="w-10 h-10 rounded-full flex items-center justify-center font-jf-openhuninn">
          10
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center">
          <Image src="/images/icon/chevron-right.svg" alt="下一頁" width={20} height={20} />
        </button>
      </div>
    </div>
  );
} 