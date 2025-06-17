import apiClient, { ApiResponse } from '@/lib/apiClient';

// 加購商品類型定義
type AddOnItem = {
  productId: number;
  name: string;
  price: number;
  addOnPrice: number;
  imageUrl: string;
  quantity?: number;
};

// API回應中的原始書籍資料結構
interface RawBookData {
  id: number;
  title: string;
  imageUrl: string;
  price: number;
}

interface PopularBooksResponse {
  books: RawBookData[];
}

// 獲取熱門商品並轉換為加購商品格式
export const fetchAddOnItems = async (): Promise<AddOnItem[]> => {
  try {

    
    const response: ApiResponse<PopularBooksResponse> = await apiClient.get('/api/homepage?sectionName=popularProducts');
    

    
    // 檢查 API 回應狀態
    if (!response.status || !response.data) {
    
      throw new Error(response.message || '獲取熱門商品失敗');
    }

    // 檢查是否有 books 陣列
    if (!response.data.books || !Array.isArray(response.data.books)) {

      return [];
    }

    // 將原始書籍資料轉換為加購商品格式
    const addOnItems: AddOnItem[] = response.data.books.map(book => ({
      productId: book.id,
      name: book.title,
      price: book.price,
      addOnPrice: Math.round(book.price * 0.5), // 加購價格為原價的50%
      imageUrl: book.imageUrl
    }));


    return addOnItems;
  } catch (error) {

    // 發生錯誤時返回空陣列，避免頁面崩潰
    return [];
  }
};

// 隨機選取指定數量的加購商品
export const getRandomAddOnItems = (addOnItems: AddOnItem[], count: number = 4): AddOnItem[] => {
  if (addOnItems.length <= count) {
    return addOnItems;
  }
  
  // 使用 Fisher-Yates 洗牌算法隨機選取
  const shuffled = [...addOnItems];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
}; 