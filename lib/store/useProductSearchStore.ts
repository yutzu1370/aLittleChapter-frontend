import { create } from 'zustand';
import { Product, Pagination } from '@/lib/types/product';
import { fetchProductsWithFilters, ProductFilters } from '@/lib/api/search';

interface ProductSearchState {
  // 搜尋條件
  searchKeyword: string;
  activeCategory: string;
  activeAgeFilters: string[];
  activeThemeFilters: string[];
  activePriceFilter: string | null;
  authorKeyword: string;
  publisherKeyword: string;
  
  // 分頁
  currentPage: number;
  
  // 資料
  products: Product[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSearchKeyword: (keyword: string) => void;
  setActiveCategory: (category: string) => void;
  setActiveAgeFilters: (filters: string[]) => void;
  setActiveThemeFilters: (filters: string[]) => void;
  setActivePriceFilter: (filter: string | null) => void;
  setAuthorKeyword: (keyword: string) => void;
  setPublisherKeyword: (keyword: string) => void;
  setCurrentPage: (page: number) => void;
  
  // 篩選操作
  toggleAgeFilter: (filter: string) => void;
  toggleThemeFilter: (filter: string) => void;
  setPriceFilter: (price: string) => void;
  clearFilters: () => void;
  
  // 查詢
  fetchProducts: () => Promise<void>;
  
  // 從 URL 參數初始化
  initFromQuery: (params: URLSearchParams) => void;
}

export const useProductSearchStore = create<ProductSearchState>((set, get) => ({
  // 初始狀態
  searchKeyword: '',
  activeCategory: '全部作品',
  activeAgeFilters: [],
  activeThemeFilters: [],
  activePriceFilter: null,
  authorKeyword: '',
  publisherKeyword: '',
  currentPage: 1,
  products: [],
  pagination: null,
  isLoading: false,
  error: null,
  
  // 設定方法
  setSearchKeyword: (keyword) => {
    set({ searchKeyword: keyword, currentPage: 1 });
    get().fetchProducts();
  },
  
  setActiveCategory: (category) => {
    set({ activeCategory: category, currentPage: 1 });
    get().fetchProducts();
  },
  
  setActiveAgeFilters: (filters) => {
    set({ activeAgeFilters: filters, currentPage: 1 });
    get().fetchProducts();
  },
  
  setActiveThemeFilters: (filters) => {
    set({ activeThemeFilters: filters, currentPage: 1 });
    get().fetchProducts();
  },
  
  setActivePriceFilter: (filter) => {
    set({ activePriceFilter: filter, currentPage: 1 });
    get().fetchProducts();
  },
  
  setAuthorKeyword: (keyword) => {
    set({ authorKeyword: keyword, currentPage: 1 });
    get().fetchProducts();
  },
  
  setPublisherKeyword: (keyword) => {
    set({ publisherKeyword: keyword, currentPage: 1 });
    get().fetchProducts();
  },
  
  setCurrentPage: (page) => {
    set({ currentPage: page });
    get().fetchProducts();
  },
  
  // 篩選操作
  toggleAgeFilter: (filter) => {
    const { activeAgeFilters } = get();
    const newFilters = activeAgeFilters.includes(filter)
      ? activeAgeFilters.filter(f => f !== filter)
      : [...activeAgeFilters, filter];
    
    set({ activeAgeFilters: newFilters, currentPage: 1 });
    get().fetchProducts();
  },
  
  toggleThemeFilter: (filter) => {
    const { activeThemeFilters } = get();
    const newFilters = activeThemeFilters.includes(filter)
      ? activeThemeFilters.filter(f => f !== filter)
      : [...activeThemeFilters, filter];

    set({ activeThemeFilters: newFilters, currentPage: 1 });
    get().fetchProducts();
  },
  
  setPriceFilter: (price) => {
    const { activePriceFilter } = get();
    const newFilter = activePriceFilter === price ? null : price;
 
    set({ activePriceFilter: newFilter, currentPage: 1 });
    get().fetchProducts();
  },
  
  clearFilters: () => {

    set({
      searchKeyword: '',
      activeCategory: '全部作品',
      activeAgeFilters: [],
      activeThemeFilters: [],
      activePriceFilter: null,
      authorKeyword: '',
      publisherKeyword: '',
      currentPage: 1
    });
    get().fetchProducts();
  },
  
  // 查詢商品
  fetchProducts: async () => {
    const state = get();
    set({ isLoading: true, error: null });
    
    try {
      // 轉換 CategoryFilter 分類名稱到篩選參數
      const getCategoryFilters = (category: string): Partial<ProductFilters> => {
        switch (category) {
          case "亮點新書":
            return { is_new_arrival: true };
          case "熱銷排行":
            return { is_bestseller: true };
          case "優惠折扣":
            return { is_discount: true };
          default:
            return {};
        }
      };
      
      // 轉換年齡篩選到API參數
      const getAgeRangeId = (ageFilter: string): number | undefined => {
        const ageMapping: { [key: string]: number } = {
          "0-3 歲": 1,
          "3-5 歲": 2,
          "5-7 歲": 3,
          "7-11 歲": 4,
          "11-13 歲": 5
        };
        return ageMapping[ageFilter];
      };
      
      // 轉換主題篩選到API參數
      const getThemeId = (theme: string): number | undefined => {
        const themeMapping: { [key: string]: number } = {
          "健康生活": 1,
          "科學知識": 2,
          "藝術啟蒙": 3,
          "音樂欣賞": 4,
          "勵志成長": 5
        };
        return themeMapping[theme];
      };
      
      // 轉換價格篩選到API參數
      const getPriceRange = (priceFilter: string | null): number | undefined => {
        if (!priceFilter) return undefined;
        const priceMapping: { [key: string]: number } = {
          "$": 1,    // 0-400元
          "$$": 2,   // 401-800元
          "$$$": 3   // 801元以上
        };
        return priceMapping[priceFilter];
      };
      
      // 多選年齡、主題轉 id 串接
      const ageIds = state.activeAgeFilters.map(getAgeRangeId).filter(Boolean).join(',');
      const themeIds = state.activeThemeFilters.map(getThemeId).filter(Boolean).join(',');
      
      const filters: ProductFilters = {
        keyword: state.searchKeyword || undefined,
        author: state.authorKeyword || undefined,
        publisher: state.publisherKeyword || undefined,
        page: state.currentPage,
        ...getCategoryFilters(state.activeCategory), // CategoryFilter 的特殊分類
      };
      
      // 設定年齡篩選
      if (ageIds) {
        (filters as any).age_range_id = ageIds;
      }
      
      // 設定主題篩選（這裡是 FilterSidebar 的主題篩選，不與 CategoryFilter 衝突）
      if (themeIds) {
        (filters as any).category_id = themeIds;
      }
      
      // 設定價格篩選
      if (state.activePriceFilter) {
        filters.price_range = getPriceRange(state.activePriceFilter);
      }
    
        
        const result = await fetchProductsWithFilters(filters);
        
 
        
        set({ 
          products: result.products, 
          pagination: result.pagination,
          isLoading: false 
        });
      } catch (err) {
   
        set({ 
          error: '載入商品資料失敗，請稍後再試',
          products: [],
          pagination: null,
          isLoading: false 
        });
      }
    },
  
  // 從 URL 參數初始化
  initFromQuery: (params) => {
    const keyword = params.get("keyword") || "";
    const categoryId = params.get("category_id") || "";
    const ageRangeId = params.get("age_range_id") || "";
    const isBestseller = params.get("is_bestseller") || "";
    const isNewArrival = params.get("is_new_arrival") || "";
    const isDiscount = params.get("is_discount") || "";
    
    // ⭐ 重要：先完全重置所有篩選條件到初始狀態
    const resetState: Partial<ProductSearchState> = {
      searchKeyword: '',
      activeCategory: '全部作品',
      activeAgeFilters: [],
      activeThemeFilters: [],
      activePriceFilter: null,
      authorKeyword: '',
      publisherKeyword: '',
      currentPage: 1
    };
    
    // 然後根據 URL 參數設定對應的值
    if (keyword) {
      resetState.searchKeyword = keyword;
    }
    
    // ⭐ 修正：category_id 對應到主題篩選（FilterSidebar），不是 CategoryFilter
    if (categoryId) {
      // 根據 category_id 設定對應的主題篩選
      const themeMapping: { [key: string]: string } = {
        "1": "健康生活",
        "2": "科學知識", 
        "3": "藝術啟蒙",
        "4": "音樂欣賞",
        "5": "勵志成長"
      };
      const themeFilter = themeMapping[categoryId];
      if (themeFilter) {
        resetState.activeThemeFilters = [themeFilter];
      }
    }
    
    // 處理特殊分類參數（這些對應到 CategoryFilter）
    if (isBestseller === "true") {
      resetState.activeCategory = "熱銷排行";
    } else if (isNewArrival === "true") {
      resetState.activeCategory = "亮點新書";
    } else if (isDiscount === "true") {
      resetState.activeCategory = "優惠折扣";
    }
    
    if (ageRangeId) {
      // 根據 age_range_id 設定對應的年齡篩選
      const ageMapping: { [key: string]: string } = {
        "1": "0-3 歲",
        "2": "3-5 歲",
        "3": "5-7 歲", 
        "4": "7-11 歲",
        "5": "11-13 歲"
      };
      const ageFilter = ageMapping[ageRangeId];
      if (ageFilter) {
        resetState.activeAgeFilters = [ageFilter];
      }
    }
    
    // 設定新狀態並觸發查詢
    set(resetState);
    get().fetchProducts();
  }
})); 