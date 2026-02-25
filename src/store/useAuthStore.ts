import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isSyncing: boolean;
  setUser: (user: AuthUser | null) => void;
  setIsSyncing: (v: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isSyncing: false,
      setUser: (user) => set({ user }),
      setIsSyncing: (isSyncing) => set({ isSyncing }),
      clearUser: () => set({ user: null, isSyncing: false }),
    }),
    {
      name: 'volleybuild-auth',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
