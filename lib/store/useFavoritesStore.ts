import { create } from 'zustand';

interface FavoritesStore {
  favoriteIds: number[];
  
  // 收藏相關操作
  addFavorite: (productId: number) => void;
  removeFavorite: (productId: number) => void;
  toggleFavorite: (productId: number) => boolean; // 返回新的收藏狀態
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
  getFavoriteCount: () => number;
}

// 檢查是否在客戶端以及 localStorage 是否可用的函數
const isLocalStorageAvailable = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    const testKey = '__favorites_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.error('localStorage 不可用:', e);
    return false;
  }
};

// 從 localStorage 讀取收藏列表
const loadFavoritesFromStorage = (): number[] => {
  if (!isLocalStorageAvailable()) return [];
  
  try {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('讀取收藏列表失敗:', error);
    return [];
  }
};

// 儲存收藏列表到 localStorage
const saveFavoritesToStorage = (favoriteIds: number[]) => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.setItem('favorites', JSON.stringify(favoriteIds));
  } catch (error) {
    console.error('儲存收藏列表失敗:', error);
  }
};

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favoriteIds: loadFavoritesFromStorage(),

  addFavorite: (productId) => {
    console.log('正在加入收藏:', productId);
    set((state) => {
      if (!state.favoriteIds.includes(productId)) {
        const newFavorites = [...state.favoriteIds, productId];
        saveFavoritesToStorage(newFavorites);
        return { favoriteIds: newFavorites };
      }
      return state;
    });
  },

  removeFavorite: (productId) => {
    console.log('正在移除收藏:', productId);
    set((state) => {
      const newFavorites = state.favoriteIds.filter(id => id !== productId);
      saveFavoritesToStorage(newFavorites);
      return { favoriteIds: newFavorites };
    });
  },

  toggleFavorite: (productId) => {
    const { favoriteIds } = get();
    const isCurrentlyFavorite = favoriteIds.includes(productId);
    
    if (isCurrentlyFavorite) {
      get().removeFavorite(productId);
      console.log('已從收藏移除:', productId);
      return false;
    } else {
      get().addFavorite(productId);
      console.log('已加入收藏:', productId);
      return true;
    }
  },

  isFavorite: (productId) => {
    const { favoriteIds } = get();
    return favoriteIds.includes(productId);
  },

  clearFavorites: () => {
    console.log('清空所有收藏');
    saveFavoritesToStorage([]);
    set({ favoriteIds: [] });
  },

  getFavoriteCount: () => {
    const { favoriteIds } = get();
    return favoriteIds.length;
  }
})); 