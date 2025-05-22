// 商品基本資料型別
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  isNew?: boolean;
  isHot?: boolean;
  authorName?: string;
  publisherName?: string;
}

// 商品詳細資料型別
export interface ProductDetail extends Product {
  promotionEnd: string;
  images: string[];
  author: {
    name: string;
    description: string;
  };
  translator: {
    name: string;
    description: string;
  };
  illustrator: {
    name: string;
    description: string;
  };
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
    description: string;
    price: number;
    discountPrice: number | null;
    stockQuantity: number;
    categoryInfo: {
      id: number;
      name: string;
    };
    ageRange: {
      id: number;
      name: string;
    };
    imageUrls: string[];
    author: string;
    illustrator: string;
    publisher: string;
    publishDate: string;
    isbn: string;
    pageCount: number;
    introductionHtml: string;
  }
} 