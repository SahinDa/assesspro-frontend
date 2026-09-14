import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import type { AuthUser } from '@/modules/user/types';
import { UserRole } from '@/config/enums';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Role selectors
  isAdmin: () => boolean;
  isOrganization: () => boolean;
  isStudent: () => boolean;

  // Actions
  login: (user: AuthUser) => void;
  setUser: (user: AuthUser | null) => void;
  updateUser: (patch: Partial<AuthUser>) => void;
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

        login: (user: AuthUser) =>
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          }),

        setUser: (user: AuthUser | null) =>
          set({
            user,
            isAuthenticated: Boolean(user),
            isLoading: false,
          }),

        // Merges partial updates without losing existing session state
        updateUser: (patch: Partial<AuthUser>) =>
          set((state) => ({
            user: state.user ? { ...state.user, ...patch } : null,
          })),

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