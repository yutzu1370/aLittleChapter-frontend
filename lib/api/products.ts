import { ProductDetail, Product, Review, ProductImage, ProductListItem, Pagination } from '@/lib/types/product';

import apiClient, { ApiResponse } from '@/lib/apiClient';

// API基礎URL常數
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.little-chapter.com';

// 獲取單一商品詳情
export async function fetchProductById(productId: string): Promise<ProductDetail> {
  try {
    
    
    // 使用 apiClient 呼叫真實的 API，參考 auth.ts 的寫法
    const response: ApiResponse = await apiClient.get(`/api/products/${productId}`);
    
    
    
    // 檢查 API 回應狀態
    if (!response.status || !response.data) {
    
      throw new Error(response.message || 'API 回應格式錯誤');
    }

    const apiData = response.data;
    
    // 添加調試日誌檢查 introductionHtml

    
    // 將 API 資料映射到 ProductDetail 格式
    const productDetail: ProductDetail = {
      // API 原始資料
      productId: apiData.productId,
      title: apiData.title,
      price: apiData.discountPrice || apiData.price, // 顯示價格：有折扣價則顯示折扣價，否則顯示原價
      discountPrice: apiData.discountPrice,
      stockQuantity: apiData.stockQuantity,
      categoryInfo: apiData.categoryInfo,
      ageRange: apiData.ageRange,
      imageUrls: apiData.imageUrls,
      author: apiData.author,
      illustrator: apiData.illustrator,
      publisher: apiData.publisher,
      publishDate: apiData.publishDate,
      isbn: apiData.isbn,
      pageCount: apiData.pageCount,
      introductionHtml: apiData.introductionHtml,
      
      // 向後相容的映射
      name: apiData.title,
      originalPrice: apiData.price, // 原價
      images: (() => {
        // 將圖片按 isPrimary 排序，主圖片排在第一位
        const sortedImages = [...apiData.imageUrls].sort((a: ProductImage, b: ProductImage) => {
          if (a.isPrimary && !b.isPrimary) return -1;
          if (!a.isPrimary && b.isPrimary) return 1;
          return 0;
        });
        
 
        
        return sortedImages.map((img: ProductImage) => img.imageUrl);
      })(),
      authorName: apiData.author,
      publisherName: apiData.publisher,
      aboutContent: apiData.introductionHtml || '', // 確保 aboutContent 正確映射
    };


    return productDetail;
  } catch (error) {
    
    throw new Error('無法載入商品資料');
  }
}

// 獲取相關商品
export async function fetchRelatedProducts(productId: string): Promise<Product[]> {
  try {
 
    
    // 使用 apiClient 呼叫真實的 API
    const response: ApiResponse = await apiClient.get(`/api/products/${productId}/related`);
    

    
    // 檢查 API 回應狀態
    if (!response.status || !response.data) {
     
      return [];
    }

    // 檢查是否有 products 陣列
    if (!response.data.products || !Array.isArray(response.data.products)) {
    
      return [];
    }

    // 將 API 資料映射到 Product 格式
    const relatedProducts: Product[] = response.data.products.map((item: ProductListItem) => ({
      id: item.productId.toString(),
      name: item.title,
      description: '', // API 回應中沒有描述，設為空字串
      price: item.discountPrice || item.price,
      originalPrice: item.price,
      image: item.imageUrl || "/images/books/placeholder.jpg",
      stockQuantity: item.stockQuantity, // 使用 API 回應的庫存數量
      isNew: item.isNewArrival || false,
      isHot: item.isBestseller || false,
      authorName: item.author,
      publisherName: item.publisher,
    }));

  
    return relatedProducts;
  } catch (error) {

    return [];
  }
}



// 根據年齡範圍獲取商品列表
export async function fetchProductsByAgeRange(ageRangeId: number): Promise<Product[]> {
  try {

    
    // 使用 apiClient 呼叫真實的 API，不設定分頁限制以獲取所有商品
    const response: ApiResponse = await apiClient.get(`/api/products?ageRangeId=${ageRangeId}&limit=100`);
    
   
    
    // 檢查 API 回應狀態
    if (!response.status || !response.data) {
  
      throw new Error(response.message || 'API 回應格式錯誤');
    }

    // 檢查是否有 products 陣列
    if (!response.data.products || !Array.isArray(response.data.products)) {
   
      return [];
    }

    // 將 API 資料映射到 Product 格式
    const products: Product[] = response.data.products.map((item: ProductListItem) => ({
      id: item.productId.toString(),
      name: item.title,
      description: '', // API 回應中沒有描述，設為空字串
      price: item.discountPrice || item.price,
      originalPrice: item.price,
      image: item.imageUrl || "/images/books/placeholder.jpg",
      stockQuantity: item.stockQuantity, // 使用 API 回應的庫存數量
      isNew: item.isNewArrival || false,
      isHot: item.isBestseller || false,
      authorName: item.author,
      publisherName: item.publisher,
    }));

    return products;
  } catch (error) {
   
    // 發生錯誤時返回空陣列，避免頁面崩潰
    return [];
  }
}

// 商品篩選參數介面
export interface ProductFilters {
  keyword?: string;
  author?: string;
  publisher?: string;
  category_id?: number;
  age_range_id?: number;
  price_range?: number;
  is_new_arrival?: boolean;
  is_bestseller?: boolean;
  is_discount?: boolean;
  page?: number;
}

// 移除 fetchProductsWithFilters，改由 lib/api/search.ts 處理 