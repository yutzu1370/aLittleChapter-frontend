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

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favoriteIds: [],

  addFavorite: (productId) => {

    set((state) => {
      if (!state.favoriteIds.includes(productId)) {
        const newFavorites = [...state.favoriteIds, productId];
        return { favoriteIds: newFavorites };
      }
      return state;
    });
  },

  removeFavorite: (productId) => {
  
    set((state) => {
      const newFavorites = state.favoriteIds.filter(id => id !== productId);
      return { favoriteIds: newFavorites };
    });
  },

  toggleFavorite: (productId) => {
    const { favoriteIds } = get();
    const isCurrentlyFavorite = favoriteIds.includes(productId);
    
    if (isCurrentlyFavorite) {
      get().removeFavorite(productId);

      return false;
    } else {
      get().addFavorite(productId);
   
      return true;
    }
  },

  isFavorite: (productId) => {
    const { favoriteIds } = get();
    return favoriteIds.includes(productId);
  },

  clearFavorites: () => {
 
    set({ favoriteIds: [] });
  },

  getFavoriteCount: () => {
    const { favoriteIds } = get();
    return favoriteIds.length;
  }
})); 