import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  expiresIn: number | null;
  login: (data: { user: User; token: string; expiresIn: number }) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      expiresIn: null,
      login: (data) => set({
        user: data.user,
        isAuthenticated: true,
        token: data.token,
        expiresIn: data.expiresIn,
      }),
      logout: () => set({
        user: null,
        isAuthenticated: false,
        token: null,
        expiresIn: null,
      }),
      updateUser: (userData) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null,
      })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        expiresIn: state.expiresIn,
      }),
    }
  )
); 