"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types/product";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
      toast.success("已從收藏移除");
    } else {
      setFavorites([...favorites, productId]);
      toast.success("已加入收藏");
    }
  };

  const handleAddToCart = (product: Product) => {
    toast.success(`已將《${product.name}》加入購物車！`);
  };

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
            <motion.div 
              key={item.id} 
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              {/* Book Image with Tag */}
              <div className="relative mb-4">
                <motion.div 
                  className="border-4 border-gray-300 rounded-xl overflow-hidden"
                  whileHover={{ 
                    borderColor: "#E8652B",
                    transition: { duration: 0.3 }
                  }}
                >
                  <Image 
                    src={item.image || "/images/books/placeholder.jpg"} 
                    alt={item.name}
                    width={354}
                    height={354}
                    className="w-full h-auto aspect-[3/4] object-cover transition-transform duration-500 hover:scale-105"
                  />
                </motion.div>

                {/* Hover Action Buttons */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center gap-2 p-6"
                >
                  <motion.button 
                    whileHover={{ scale: 1.05, backgroundColor: "#E8652B", color: "white" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 h-12 bg-white border-2 border-[#E8652B] text-[#E8652B] rounded-full font-semibold shadow-[4px_6px_0px_#74281A] transition-colors duration-100"
                    onClick={() => handleAddToCart(item)}
                  >
                    加入購物車
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 bg-white border-2 ${
                      favorites.includes(item.id) 
                        ? "border-[#E8652B] bg-[#FEF5EE]" 
                        : "border-[#E8652B]"
                    } rounded-full flex items-center justify-center shadow-[4px_6px_0px_#74281A]`}
                    onClick={() => toggleFavorite(item.id)}
                    aria-label={favorites.includes(item.id) ? "從收藏移除" : "加入收藏"}
                  >
                    <Heart 
                      className={`w-6 h-6 ${
                        favorites.includes(item.id) 
                          ? "text-[#E8652B] fill-[#E8652B]" 
                          : "text-[#E8652B]"
                      }`} 
                    />
                  </motion.button>
                </div>
              </div>

              {/* Book Info */}
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Title */}
                <Link href={`/products/${item.id}`}>
                  <h3 className="text-xl text-[#2F726D] font-['jf-openhuninn-2.0'] hover:text-[#E8652B] transition-colors duration-300 cursor-pointer">
                    {item.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-end">
                  <motion.span 
                    className="text-xl text-[#E8652B] font-['jf-openhuninn-2.0']"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    NT${item.price}
                  </motion.span>
                  <span className="ml-2 text-sm text-gray-700 line-through">原價 NT${item.originalPrice}</span>
                </div>
              </motion.div>
            </motion.div>
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