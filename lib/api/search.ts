import { Product, Pagination, ProductListItem } from '@/lib/types/product';
import apiClient, { ApiResponse } from '@/lib/apiClient';

export interface ProductFilters {
  keyword?: string;
  author?: string;
  publisher?: string;
  category_id?: number | string;
  age_range_id?: number | string;
  price_range?: number;
  is_new_arrival?: boolean;
  is_bestseller?: boolean;
  is_discount?: boolean;
  page?: number;
  age_range_name?: string;
  category_name?: string;
}

export async function fetchProductsWithFilters(filters: ProductFilters = {}): Promise<{
  products: Product[];
  pagination: Pagination;
}> {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const apiUrl = `/api/search?${queryParams.toString()}`;
    console.log('[search.ts] API 請求 URL:', apiUrl);
    console.log('[search.ts] 篩選參數:', filters);
    
    const response: ApiResponse = await apiClient.get(apiUrl);
    
    console.log('[search.ts] API 原始回應:', response);
    
    if (!response.status || !response.data) {
      throw new Error(response.message || '獲取商品列表失敗');
    }
    
    console.log('[search.ts] API 回應商品數量:', response.data.products?.length || 0);
    console.log('[search.ts] API 回應分頁資訊:', response.data.pagination);
    console.log('[search.ts] API 回應商品內容 (前3筆):', response.data.products?.slice(0, 3));
    
    const products: Product[] = response.data.products.map((item: ProductListItem) => ({
      id: item.productId.toString(),
      name: item.title,
      description: '',
      price: item.discountPrice || item.price,
      originalPrice: item.price,
      image: item.imageUrl || "/images/books/placeholder.jpg",
      stockQuantity: item.stockQuantity,
      isNew: item.isNewArrival || false,
      isHot: item.isBestseller || false,
      authorName: item.author,
      publisherName: item.publisher,
      categoryName: item.categoryName,
      ageRangeName: item.ageName,
    }));
    
    console.log('[search.ts] 轉換後商品數量:', products.length);
    console.log('[search.ts] 轉換後商品內容 (前3筆):', products.slice(0, 3));
    
    return {
      products,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('[search.ts] 獲取商品列表時發生錯誤:', error);
    throw new Error('無法載入商品資料');
  }
} 