import { create } from 'zustand'
import type { UserRoleType } from '../config/enums'

interface AppState {
  userRole: UserRoleType | null;
  setUserRole: (role: UserRoleType | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  userRole: null,
  setUserRole: (role) => set({ userRole: role }),
}))