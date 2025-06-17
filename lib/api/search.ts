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

    
    const response: ApiResponse = await apiClient.get(apiUrl);
    

    
    if (!response.status || !response.data) {
      throw new Error(response.message || '獲取商品列表失敗');
    }
    
    
    
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
    

    
    return {
      products,
      pagination: response.data.pagination
    };
  } catch (error) {
  
    throw new Error('無法載入商品資料');
  }
} 