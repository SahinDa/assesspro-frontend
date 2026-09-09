import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/modules/user/types';
import { UserRole } from '@/types/enums';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Role selectors
  isAdmin: () => boolean;
  isOrganization: () => boolean;
  isStudent: () => boolean;

  // Actions
  login: (user: User) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,

        isAdmin: () => get().user?.role === UserRole.ADMIN,
        isOrganization: () => get().user?.role === UserRole.ORGANIZATION,
        isStudent: () => get().user?.role === UserRole.STUDENT,

        login: (user: User) =>
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          }),

        setUser: (user: User | null) =>
          set({
            user,
            isAuthenticated: Boolean(user),
            isLoading: false,
          }),

        clearAuth: () =>
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          }),
      }),
      {
        name: 'assesspro-auth-session',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);