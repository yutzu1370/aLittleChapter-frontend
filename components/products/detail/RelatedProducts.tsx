"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types/product";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="w-12 h-12 overflow-hidden">
            <Image 
              src="/images/icon/icon_map.png" 
              alt="探索更多故事" 
              width={48} 
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 font-jf-openhuninn tracking-wider">探索更多故事</h2>
        </div>

        {/* 相關商品卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div key={item.id} className="flex flex-col bg-white">
              <div className="relative aspect-[3/4] mb-6 group">
                <Image 
                  src={item.image || "/images/books/placeholder.jpg"} 
                  alt={item.name}
                  fill
                  className="object-cover rounded-2xl border-4 border-gray-200"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-2xl p-6">
                  <button className="w-full bg-white text-orange-500 rounded-full border-2 border-orange-500 py-3 font-semibold shadow-md mb-2 hover:bg-orange-50 transition-colors">
                    加入購物車
                  </button>
                  <button className="w-12 h-12 bg-white rounded-full border-2 border-orange-500 flex items-center justify-center shadow-md hover:bg-orange-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              <Link href={`/products/${item.id}`} className="group-hover:text-orange-500">
                <h3 className="text-lg font-bold text-emerald-800 font-jf-openhuninn mb-2">{item.name}</h3>
              </Link>
              <div className="flex items-end gap-2">
                <span className="text-lg font-bold text-orange-500">${item.price}</span>
                <span className="text-sm text-gray-500 line-through">原價 NT${item.originalPrice}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 前後頁按鈕 */}
        <button className="absolute top-1/2 -left-5 bg-orange-500 text-white rounded-full p-5 shadow-[4px_6px_0px_0px_rgba(116,40,26,1)] hover:translate-y-1 hover:shadow-[2px_3px_0px_0px_rgba(116,40,26,1)] transition-all hidden md:block">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="absolute top-1/2 -right-5 bg-orange-500 text-white rounded-full p-5 shadow-[4px_6px_0px_0px_rgba(116,40,26,1)] hover:translate-y-1 hover:shadow-[2px_3px_0px_0px_rgba(116,40,26,1)] transition-all hidden md:block">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
} 