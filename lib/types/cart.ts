import { Product } from './product';

// 購物車項目類型
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  isSelected: boolean; // 是否被選中結帳
}

// 加購商品類型
export interface AddOnItem {
  id: string;
  name: string;
  image: string;
  originalPrice: number;
  discountPrice: number;
} 