"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative w-full h-80">
          <Image
            src={product.image || "/images/books/placeholder.jpg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.originalPrice > product.price && (
            <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-xl font-bold text-emerald-800 font-jf-openhuninn mb-2 group-hover:text-orange-500 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xl font-bold text-orange-500">NT$ {product.price}</p>
            {product.originalPrice > product.price && (
              <p className="text-sm text-gray-500 line-through">原價 NT$ {product.originalPrice}</p>
            )}
          </div>
          
          <button className="bg-orange-500 text-white rounded-full p-3 hover:bg-orange-600 transition-colors duration-200 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 