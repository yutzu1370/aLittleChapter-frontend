"use client";

import Image from "next/image";
import { Review } from "@/lib/types/product";

interface ProductReviewsProps {
  reviews: Review[];
}

export default function ProductReviews({ reviews }: ProductReviewsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="w-12 h-12 overflow-hidden">
            <Image 
              src="/images/icon/icon_comment.png" 
              alt="會員評價" 
              width={48} 
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 font-jf-openhuninn tracking-wider">會員評價</h2>
        </div>

        <div className="bg-amber-50 rounded-[48px] p-8 md:p-16">
          {/* 評分統計 */}
          <div className="mb-8">
            <div className="flex items-center mb-1">
              <span className="text-4xl font-coiny text-orange-500 mr-2">5.0</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-6 h-6 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <span>{reviews.length} 則評分</span>
              <span className="mx-1">・</span>
              <span>{reviews.length} 則評價</span>
            </div>
          </div>

          {/* 評論列表 */}
          <div className="space-y-6 mb-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-6 border-4 border-amber-200">
                {/* 用戶資訊 */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-200 mr-3">
                    <Image 
                      src={review.profilePic} 
                      alt={review.username} 
                      width={48} 
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{review.username}</p>
                  </div>
                </div>

                {/* 評分與日期 */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-gray-500 text-sm">{review.date}</div>
                </div>

                {/* 評論內容 */}
                <p className="text-gray-800 whitespace-pre-line mb-4">
                  {review.content}
                </p>

            
              </div>
            ))}
          </div>

          {/* 查看所有評論按鈕 */}
          <div className="flex justify-end">
            <button className="flex items-center text-gray-800 font-semibold hover:text-orange-500">
              查看所有評論
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 