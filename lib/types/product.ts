// 商品基本資料型別
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
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