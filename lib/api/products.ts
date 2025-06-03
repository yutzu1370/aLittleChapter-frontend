import { ProductDetail, Product, Review, ProductImage, ProductListItem } from '@/lib/types/product';
import { getMockReviews } from '../mocks/products';
import apiClient, { ApiResponse } from '@/lib/apiClient';

// API基礎URL常數
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.little-chapter.com';

// 獲取單一商品詳情
export async function fetchProductById(productId: string): Promise<ProductDetail> {
  try {
    console.log(`正在獲取商品 ID: ${productId} 的詳情...`);
    console.log('使用的 API 端點:', `/api/products/${productId}`);
    
    // 使用 apiClient 呼叫真實的 API，參考 auth.ts 的寫法
    const response: ApiResponse = await apiClient.get(`/api/products/${productId}`);
    
    console.log('API 回應:', response);
    console.log('API 回應狀態:', response.status);
    console.log('API 回應資料:', response.data);
    
    // 檢查 API 回應狀態
    if (!response.status || !response.data) {
      console.error('API 回應格式錯誤:', response);
      throw new Error(response.message || 'API 回應格式錯誤');
    }

    const apiData = response.data;
    
    // 添加調試日誌檢查 introductionHtml
    console.log('API 回應中的 introductionHtml:', apiData.introductionHtml);
    console.log('introductionHtml 類型:', typeof apiData.introductionHtml);
    console.log('introductionHtml 長度:', apiData.introductionHtml?.length);
    
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
        
        console.log('原始圖片陣列:', apiData.imageUrls);
        console.log('排序後圖片陣列:', sortedImages);
        
        return sortedImages.map((img: ProductImage) => img.imageUrl);
      })(),
      authorName: apiData.author,
      publisherName: apiData.publisher,
      aboutContent: apiData.introductionHtml || '', // 確保 aboutContent 正確映射
    };

    console.log('映射後的產品詳情:', productDetail);
    return productDetail;
  } catch (error) {
    console.error('獲取商品詳情時發生錯誤:', error);
    throw new Error('無法載入商品資料');
  }
}

// 獲取相關商品
export async function fetchRelatedProducts(productId: string): Promise<Product[]> {
  try {
    console.log(`正在獲取商品 ID: ${productId} 的相關商品...`);
    
    // 使用 apiClient 呼叫真實的 API
    const response: ApiResponse = await apiClient.get(`/api/products/${productId}/related`);
    
    console.log('相關商品 API 回應:', response);
    
    // 檢查 API 回應狀態
    if (!response.status || !response.data) {
      console.error('相關商品 API 回應格式錯誤:', response);
      return [];
    }

    // 檢查是否有 products 陣列
    if (!response.data.products || !Array.isArray(response.data.products)) {
      console.log('API 回應中沒有相關商品:', response.data);
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
      isNew: item.isNewArrival || false,
      isHot: item.isBestseller || false,
      authorName: item.author,
      publisherName: item.publisher,
    }));

    console.log(`成功獲取 ${relatedProducts.length} 個相關商品`);
    return relatedProducts;
  } catch (error) {
    console.error('獲取相關商品時發生錯誤:', error);
    return [];
  }
}

// 獲取商品評論
export async function fetchProductReviews(productId: string): Promise<Review[]> {
  try {
    // 在實際環境中，這裡會使用axios呼叫真實的API
    // const response = await apiClient.get(`/api/products/${productId}/reviews`);
    // return response.data;
    
    // 使用Mock數據
    const reviews = getMockReviews();
    
    // 模擬axios請求與網路延遲
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(reviews);
      }, 250);
    });
  } catch (error) {
    console.error('獲取商品評論時發生錯誤:', error);
    return [];
  }
}

// 根據年齡範圍獲取商品列表
export async function fetchProductsByAgeRange(ageRangeId: number): Promise<Product[]> {
  try {
    console.log(`正在獲取年齡範圍 ID: ${ageRangeId} 的所有商品...`);
    
    // 使用 apiClient 呼叫真實的 API，不設定分頁限制以獲取所有商品
    const response: ApiResponse = await apiClient.get(`/api/products?ageRangeId=${ageRangeId}&limit=100`);
    
    console.log('API 回應:', response);
    
    // 檢查 API 回應狀態
    if (!response.status || !response.data) {
      console.error('API 回應格式錯誤:', response);
      throw new Error(response.message || 'API 回應格式錯誤');
    }

    // 檢查是否有 products 陣列
    if (!response.data.products || !Array.isArray(response.data.products)) {
      console.error('API 回應中沒有 products 陣列:', response.data);
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
      isNew: item.isNewArrival || false,
      isHot: item.isBestseller || false,
      authorName: item.author,
      publisherName: item.publisher,
    }));

    console.log(`成功獲取 ${products.length} 個相關商品`);
    return products;
  } catch (error) {
    console.error('獲取年齡範圍商品時發生錯誤:', error);
    // 發生錯誤時返回空陣列，避免頁面崩潰
    return [];
  }
} 