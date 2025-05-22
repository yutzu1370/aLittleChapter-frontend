import { ProductDetail, Product, Review, ProductResponse } from '@/lib/types/product';
import { getMockProductById, getMockRelatedProducts, getMockReviews } from '../mocks/products';
import axios from 'axios';

// API基礎URL常數
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.little-chapter.com';

// 獲取單一商品詳情
export async function fetchProductById(productId: string): Promise<ProductResponse> {
  try {
    // 在實際環境中，這裡會使用axios呼叫真實的API
    // const response = await axios.get<ProductResponse>(`${API_BASE_URL}/products/${productId}`);
    // return response.data;
    
    // 使用Mock數據
    const productResponse = getMockProductById(productId);
    
    // 模擬axios請求與網路延遲
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(productResponse);
      }, 300);
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('獲取商品詳情時發生錯誤:', error.response?.data || error.message);
    } else {
      console.error('獲取商品詳情時發生未知錯誤:', error);
    }
    throw new Error('無法載入商品資料');
  }
}

// 獲取相關商品
export async function fetchRelatedProducts(productId: string): Promise<Product[]> {
  try {
    // 在實際環境中，這裡會使用axios呼叫真實的API
    // const response = await axios.get(`${API_BASE_URL}/products/${productId}/related`);
    // return response.data;
    
    // 使用Mock數據
    const relatedProducts = getMockRelatedProducts(productId);
    
    // 模擬axios請求與網路延遲
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(relatedProducts);
      }, 200);
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('獲取相關商品時發生錯誤:', error.response?.data || error.message);
    } else {
      console.error('獲取相關商品時發生未知錯誤:', error);
    }
    return [];
  }
}

// 獲取商品評論
export async function fetchProductReviews(productId: string): Promise<Review[]> {
  try {
    // 在實際環境中，這裡會使用axios呼叫真實的API
    // const response = await axios.get(`${API_BASE_URL}/products/${productId}/reviews`);
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
    if (axios.isAxiosError(error)) {
      console.error('獲取商品評論時發生錯誤:', error.response?.data || error.message);
    } else {
      console.error('獲取商品評論時發生未知錯誤:', error);
    }
    return [];
  }
} 