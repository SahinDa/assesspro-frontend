import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AuthUser , ActiveOrganization } from '@/modules/user/types';
import { UserRole } from '@/config/enums';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;

  // Role selectors
  isAdmin: () => boolean;
  isOrganization: () => boolean;
  isStudent: () => boolean;

  // Actions
  login: (user: AuthUser) => void;
  setUser: (user: AuthUser | null) => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  setInitialized: (initialized: boolean) => void;
  getActiveOrg: () => ActiveOrganization | null;
  hasActiveOrg: () => boolean;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isInitialized: false,
        isLoading: false,

        isAdmin: () => get().user?.role === UserRole.ADMIN,
        isOrganization: () => get().user?.role === UserRole.ORGANIZATION,
        isStudent: () => get().user?.role === UserRole.STUDENT,

        getActiveOrg: () => get().user?.activeOrganization ?? null,
        hasActiveOrg: () => Boolean(get().user?.activeOrganization),

        login: (user: AuthUser) =>
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
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

          setInitialized: (isInitialized: boolean) =>
          set({ isInitialized }),

        clearAuth: () =>
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: true,
          }),
      }),
    { name: 'AuthStore' }
  )
);