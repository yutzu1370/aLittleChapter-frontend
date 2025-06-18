"use client";

import Image from "next/image";
import { Review } from "@/lib/types/product";
import { useState, useEffect } from "react";
import apiClient, { ApiResponse } from "@/lib/apiClient";

interface ProductReviewsProps {
  productId: number;
}

// API 回應格式
interface ReviewsApiResponse {
  status: boolean;
  data: {
    averageRating: number;
    reviewCount: number;
    reviews: {
      productId: number;
      productTitle: string;
      productImageUrl: string;
      content: string;
      rating: number;
      username: string;
      userAvatar: string;
      createdAt: string;
    }[];
  };
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [showAllReviews, setShowAllReviews] = useState(false);

  // 獲取評論資料
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response: ApiResponse<ReviewsApiResponse['data']> = await apiClient.get(
          `/api/products/reviews?productId=${productId}`
        );

        if (!response.status || !response.data) {
          throw new Error(response.message || '獲取評論失敗');
        }

        const { averageRating, reviewCount, reviews: apiReviews } = response.data;

        // 轉換 API 資料格式為元件所需格式
        const transformedReviews: Review[] = apiReviews.map((review, index) => ({
          id: index + 1,
          username: review.username,
          level: 1, // API 沒有提供 level，設為預設值
          profilePic: review.userAvatar || "/images/user_icon/user_icon_3.png", // 使用 API 提供的頭像
          userAvatar: review.userAvatar || "/images/user_icon/user_icon_3.png", // 新增買家頭像
          rating: review.rating,
          date: new Date(review.createdAt).toLocaleDateString('zh-TW'),
          content: review.content,
          likes: 0, // API 沒有提供 likes，設為預設值
          isLiked: false
        }));

        setReviews(transformedReviews);
        setAverageRating(averageRating);
        setReviewCount(reviewCount);
      } catch (err) {
       
        setError('載入評論失敗');
        // 設為預設值
        setReviews([]);
        setAverageRating(0);
        setReviewCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleImageError = (reviewId: string) => {
    setFailedImages(prev => new Set(prev).add(reviewId));
  };

  const handleShowAllReviews = () => {
    setShowAllReviews(true);
  };

  // 顯示載入中狀態
  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">載入評論中...</div>
          </div>
        </div>
      </section>
    );
  }

  // 顯示錯誤狀態
  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 lg:mb-16">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 overflow-hidden flex-shrink-0">
            <Image 
              src="/images/icon/icon_comment.png" 
              alt="會員評價" 
              width={48} 
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-800 font-jf-openhuninn tracking-wider">會員評價</h2>
        </div>

        <div className="bg-[#FEF5EE] rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 sm:p-8 lg:p-16">
          {/* 評分統計 */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center mb-1">
              <span className="text-3xl sm:text-4xl font-coiny text-orange-500 mr-2">
                {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star} 
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${star <= averageRating ? 'text-yellow-400' : 'text-gray-300'} fill-current`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
            <div className="flex items-center text-gray-500 text-xs sm:text-sm">
              <span>{reviewCount} 則評分</span>
              <span className="mx-1">・</span>
              <span>{reviewCount} 則評價</span>
            </div>
          </div>

          {/* 評論列表 */}
          {reviews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {displayedReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-4 sm:p-6 border-2 sm:border-4 border-[#F8D0B0] h-full flex flex-col">
                {/* 用戶資訊 */}
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <Image 
                      src={failedImages.has(review.id.toString()) ? "/images/user_icon/user_icon_3.png" : review.profilePic}
                      alt={review.username} 
                      width={48} 
                      height={48}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(review.id.toString())}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{review.username}</p>
                  </div>
                </div>

                {/* 評分與日期 */}
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24"
                        >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-gray-500 text-xs sm:text-sm">{review.date}</div>
                </div>

                {/* 評論內容 */}
                <p className="text-gray-800 whitespace-pre-line mb-3 sm:mb-4 flex-grow text-sm sm:text-base leading-relaxed">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
          ) : (
            <div className="text-center text-gray-500 py-6 sm:py-8">
              <p className="text-sm sm:text-base">目前還沒有評論</p>
            </div>
          )}

          {/* 查看所有評論按鈕 */}
          {reviews.length > 3 && (
            <div className="flex justify-end">
              <button 
                onClick={showAllReviews ? () => setShowAllReviews(false) : handleShowAllReviews}
                className="flex items-center text-gray-800 font-semibold hover:text-orange-500 text-sm sm:text-base"
              >
                {showAllReviews ? "隱藏評論" : "查看所有評論"}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 