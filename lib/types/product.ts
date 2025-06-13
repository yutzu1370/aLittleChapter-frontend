// 商品基本資料型別
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  stockQuantity: number;
  isNew?: boolean;
  isHot?: boolean;
  authorName?: string;
  publisherName?: string;
  categoryName?: string;
  ageRangeName?: string;
}

// API 回應中的圖片資料型別
export interface ProductImage {
  imageUrl: string;
  isPrimary: boolean;
}

// API 回應中的分類資料型別
export interface CategoryInfo {
  id: number;
  name: string;
}

// API 回應中的年齡範圍資料型別
export interface AgeRange {
  id: number;
  name: string;
}

// 商品詳細資料型別 - 根據新 API 格式更新
export interface ProductDetail {
  productId: number;
  title: string;
  price: number;
  discountPrice: number | null;
  stockQuantity: number;
  categoryInfo: CategoryInfo;
  ageRange: AgeRange;
  imageUrls: ProductImage[];
  author: string;
  illustrator: string;
  publisher: string;
  publishDate: string;
  isbn: string;
  pageCount: number;
  introductionHtml: string;
  // 為了向後相容，保留一些舊的屬性
  name: string;
  originalPrice: number;
  images: string[];
  authorName?: string;
  publisherName?: string;
  aboutContent: string;
}

// 評論資料型別
export interface Review {
  id: number;
  username: string;
  level: number;
  profilePic: string;
  rating: number;
  date: string;
  content: string;
  likes: number;
  isLiked?: boolean;
}

// API回應格式 - 商品詳情
export interface ProductResponse {
  status: boolean;
  data: {
    productId: number;
    title: string;
    price: number;
    discountPrice: number | null;
    stockQuantity: number;
    categoryInfo: CategoryInfo;
    ageRange: AgeRange;
    imageUrls: ProductImage[];
    author: string;
    illustrator: string;
    publisher: string;
    publishDate: string;
    isbn: string;
    pageCount: number;
    introductionHtml: string;
  }
}

// 分頁資訊型別
export interface Pagination {
  page: number;
  limit: number;
  totalNum: number;
  totalPages: number;
}

// 商品列表項目型別 - 對應 API 回應格式
export interface ProductListItem {
  productId: number;
  title: string;
  ageRangeName: string;
  categoryName: string;
  author: string;
  publisher: string;
  price: number;
  discountPrice: number | null;
  imageUrl: string;
  isNewArrival: boolean;
  isBestseller: boolean;
  isDiscount: boolean;
  quantity: number;
  stockQuantity: number;
}

// API回應格式 - 商品列表
export interface ProductListResponse {
  status: boolean;
  data: {
    pagination: Pagination;
    products: ProductListItem[];
  };
} 